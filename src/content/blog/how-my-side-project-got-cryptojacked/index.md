---
title: "How My Side Project Got Cryptojacked (And How I Traced the Attack)"
subtitle: "A cryptominer ran on my tax calculator for 61 days — here's how I found it and how they found me"
date: 2026-04-04
tags: [security, docker, nextjs, self-hosting, coolify, hetzner, cryptojacking, devops]
author: Adam Davies
draft: true
---

I deployed a simple tax calculator to my self-hosted server. Two months later, I discovered a cryptominer had been silently running on it at ~367% CPU for 61 days. Here's how I investigated the breach, traced the attack vector, and figured out exactly how the attacker found me — even though I never advertised the site to anyone.

## The Setup

The app was a Next.js tax splitting calculator, containerized with Docker and deployed on a Hetzner VPS via Coolify. Nothing fancy — a form that takes income numbers and splits a tax bill. It was running at `tax-split.cargobay.dev`.

The stack:
- Next.js 15.2.4
- Docker (node:20-alpine)
- Coolify for deployment
- Hetzner VPS

## The Discovery

I noticed something was off when checking my container processes. Here's what I found:

| Timestamp | Event |
|---|---|
| Jan 28 | Container started, Next.js server running normally |
| Feb 9 | Shell script dropper executed (`/bin/sh /dev/fd/3`) |
| Mar 2 | 4 `crond` persistence processes spawned |
| Mar 5 | Cryptominer binary `XXGDiCeL` started, running at ~367% CPU |

The miner had been running for **61 days** before I caught it. Every malicious process was a child of the Next.js server process — meaning the attacker exploited the web application itself, not the host OS.

## Finding the Attack Vector

### Next.js 15.2.4 Was Full of Holes

Running `npm audit` on my project revealed **10 known vulnerabilities** in the `next` package alone, including:

- **CRITICAL: Remote Code Execution via React flight protocol** (GHSA-9qr9-h5gf-34mp)
- SSRF via improper middleware redirect handling
- Server Actions source code exposure
- HTTP request smuggling in rewrites

The RCE vulnerability was the smoking gun. It allows an attacker to execute arbitrary code through the React Server Components protocol — which is exactly how a Next.js server process could spawn child shell processes.

### I Was Also Leaking Stack Traces

My API error handler was returning `error.stack` to the client:

```typescript
return NextResponse.json({
  success: false,
  error: error.message,
  details: error.stack, // Leaking internal paths, versions, Node internals
}, { status: 400 })
```

While this wasn't the attack vector, it hands reconnaissance information to anyone who pokes the API — exact Node.js version, file paths, dependency structure.

## The Real Question: How Did They Find Me?

I never advertised this site. It was a personal tool on a subdomain. I assumed nobody would ever find it.

I was wrong.

### Certificate Transparency Logs: Your Domains Are Public

Every time a Certificate Authority (like Let's Encrypt) issues a TLS certificate, it **must** log that certificate in public Certificate Transparency (CT) logs. This is a security feature — it lets domain owners detect unauthorized certificates. But it has an unintended consequence: it's a real-time announcement of every new domain and subdomain on the internet.

I checked [crt.sh](https://crt.sh/?q=cargobay.dev) for my domain and found **every subdomain I'd ever deployed** was publicly catalogued:

| Subdomain | Cert Issued |
|---|---|
| `tax-split.cargobay.dev` | Jan 18, 2026 |
| `coolify.cargobay.dev` | Dec 17, 2025 |
| `vaultwarden.cargobay.dev` | Dec 17, 2025 |
| `supabase.cargobay.dev` | Dec 17, 2025 |
| `n8n.cargobay.dev` | Dec 17, 2025 |
| Plus several more apps and Coolify-generated subdomains | Various |

You can't opt out of CT logging — it's mandatory for browser-trusted certificates. The moment Coolify requested a Let's Encrypt cert for `tax-split.cargobay.dev`, its existence was broadcast publicly.

### The Attack Timeline Makes Sense Now

1. **Jan 18** — Cert issued for `tax-split.cargobay.dev`, logged in CT logs
2. **Automated scanner** picks it up (tools like `certstream` provide a real-time firehose of every cert being issued globally)
3. **Fingerprinting** — Next.js identifies itself via `x-powered-by: Next.js` headers and `/_next/` asset paths. No guesswork needed.
4. **Feb 9** (22 days later) — RCE exploit fires, shell dropper executes
5. **Mar 2** — Cron persistence installed
6. **Mar 5** — Cryptominer deployed

## It Was Fully Automated

This wasn't a targeted attack. Nobody looked at my tax calculator and decided to hack it. This was an automated pipeline:

1. **Monitor CT logs** for new domains
2. **Scan and fingerprint** the tech stack via HTTP headers
3. **Spray known CVE exploits** against matching versions
4. **Drop a standard toolkit** — shell dropper → cron persistence → miner binary
5. **Profit** — at scale across thousands of compromised hosts

The miner (`XXGDiCeL`) was almost certainly a repackaged [XMRig](https://github.com/xmrig/xmrig) Monero miner. Running 3-4 cores for 61 days would have earned the attacker roughly **$2-4** from my server. But across thousands of compromised containers, that adds up.

Monero's RandomX mining algorithm is specifically designed to be CPU-friendly and to look like normal workload — no GPU spikes, no unusual memory patterns. That's why my hosting provider didn't flag it, and why I didn't notice for two months.

## Why Hetzner Didn't Catch It

You'd expect a hosting provider to notice a cryptominer. Hetzner does have abuse detection, but:

- **367% CPU on a multi-core VPS** still leaves headroom — it looks like a busy app, not a pegged server
- **Container workloads** look opaque from the hypervisor level
- **RandomX** is designed to mimic normal CPU workload
- **Mining pool traffic** is just a small persistent TCP connection — nothing suspicious

I actually **upgraded my server** around this time because things felt slow. I thought I was running too many services. In hindsight, I may have been subsidizing a cryptominer with a bigger box.

## Lessons Learned

### 1. Keep Dependencies Updated

This was the root cause. Dependabot would have opened a PR for the Next.js critical CVE automatically. After the incident, I enabled it — and sure enough, it immediately bumped Next.js from 15.2.4 to 15.5.14, patching all the vulnerabilities.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 2. Set Resource Limits on Containers

A tax calculator doesn't need 4 CPU cores. If I'd set Docker resource limits, the miner would have been throttled to a fraction of a core:

```yaml
deploy:
  resources:
    limits:
      cpus: "0.5"
      memory: 256M
```

Coolify has these fields built into the deployment settings. Use them.

### 3. Pin Your Dependencies

Several of my deps were set to `latest` in `package.json`. This means builds are non-deterministic, and you can't track what version you're actually running. Pin to specific versions.

### 4. Don't Leak Error Details

Never return `error.stack` to the client. It's free reconnaissance for attackers.

### 5. "Nobody Will Find My App" Is Not a Security Strategy

Certificate Transparency logs, DNS enumeration, Shodan, Censys, and plain port scanning mean every public service is discoverable within hours of deployment. Security through obscurity doesn't exist on the modern internet.

If a service doesn't need to be public, put it behind Cloudflare Tunnel, Tailscale, or a VPN. If it does need to be public, keep it patched.

## The Fix

- Updated Next.js to 15.5.14 (patching all critical CVEs)
- Enabled Dependabot for automated dependency updates
- Added `npm audit` to CI pipeline
- Set container resource limits
- Removed stack trace leak from error handler
- Rebuilt the container from scratch (the old one was compromised)

---

*The attacker made about $3 from my server. My electricity cost to run their miner was probably more than that. The real cost was the lesson — which, hopefully, this post saves you from learning the hard way.*
