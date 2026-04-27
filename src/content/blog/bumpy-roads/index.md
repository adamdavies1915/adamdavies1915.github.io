---
title: "Navigating the Bumpy Roads of New Orleans"
subtitle: "How I turned my phone into a road quality scanner for bikes"
date: 2026-04-18
image: ./cover.jpg
tags: [civic-hacking, ai-coding, signal-processing, new-orleans, cycling, side-projects, bike-streets, accelerometer, lpc, smartroadsense]
author: Adam Davies
draft: true
---

## The original idea

I moved permanently to New Orleans about 3 years ago. I have always thought the city is great for cycling. It is one of the few cities in the US that is so densely populated with everything you want to do within a 30 minute bike ride. There is a mix of thoroughfares and side streets and you can mostly get everywhere you want on quiet streets (if you know which ones to use).

Well, it was my frustration at having to use painted bike lanes on 35 mph speed limit roads that originally got me thinking. These "sandwich lanes" are common in the city. Cars roar past at 35mph+ on your left. While on your right, parked cars where you're rolling the dice that the driver isn't going to suddenly open their door on you. While you might be riding 20+mph yourself trying to get to your destination as quickly as possible to get this whole stressful thing to be over.

Well my hypothesis was this. There must be a network of side streets in Uptown New Orleans that are smooth enough that I can ride from one end of the city to the other without having to ride on these sandwich lanes. The roads are definitely there, you can see them quite clearly on a map. The condition of those roads is another problem entirely.

Even if you did find the time to map the condition of the roads there, the roadscape in the city is ever changing. Work funded by FEMA from Hurricane Katrina is still being completed. Blocks that were borderline unrideable are being transformed a couple months later to smooth pavement.

## The big idea

About a couple of years ago I had an idea. My phone sits on my bike handlebars for turn by turn navigation. What if I could leverage that and use the phone's accelerometer to measure the roughness of the road I was riding on while we moved. Basically store the movement of the phone with GPS co-ordinates. If the phone is being shaken about more, it's more of a bumpy road.

Well, like most good ideas, I wasn't the first to have it. I set off on research and the application and research paper that stood out to me was **SmartRoadSense**. Created for a research paper by a couple of Italian academics, it seemed to be one of the first applications of using phone accelerometers to find the roughness of pavement. The idea was to put the phones into cars and buses. Sounds great, let's use that to build my bike-specific app and go from there.

The problem? Well I'm just a software engineer and in the paper... that's a lot of math. It starts gently enough, but by equations 6 and 7 the pages look like this:

<figure class="not-prose my-6 mx-auto max-w-xl border border-[var(--color-terminal-green)]/30 rounded bg-black/40">
  <figcaption class="text-[10px] tracking-[0.2em] uppercase text-gray-500 border-b border-[var(--color-terminal-green)]/20 px-4 py-2 font-[var(--font-mono)]">From SmartRoadSense, eq. (6), (7)</figcaption>
  <div class="px-6 py-6 text-gray-100">
    <div class="text-xs uppercase tracking-wider text-gray-500 mb-2 font-[var(--font-mono)]">Power of prediction error (per axis)</div>

$$P_{PE} = \frac{1}{M} \sum_{n=1}^{M-1} e(n)^2$$

  <div class="text-xs uppercase tracking-wider text-gray-500 mt-6 mb-2 font-[var(--font-mono)]">Roughness index (combine axes)</div>

$$R_I = \frac{1}{3}\left(P_{PE,X} + P_{PE,Y} + P_{PE,Z}\right)$$

  </div>
</figure>

Which is fine, except $e(n)$ is itself the residual of a Levinson-Durbin recursion over an 8-term autocorrelation sum, which I'd never heard of and couldn't picture. I could try, but it's not something I could usually understand without help. The idea was cool but it was out of reach for me to technically implement.

## Part 2: Claude Code changes the equation

Since putting this idea in the proverbial drawer 2 years ago, a lot in software engineering has changed. Most of my code is now not written by me but by LLMs. Claude Code so far is (in my opinion) the industry best in helping build software. So day to day, I have a really good helpful assistant that can understand a lot of maths and things about the world. And doesn't lie most of the time.

What brings up the problem again for me is my work with [Bike Streets](https://bikestreets.com/). The Bike Streets app started the expansion to New Orleans by contacting [Bike Easy](https://www.bikeeasy.org/) (the local advocacy organization for people who get around by bikes) to build a team who could chart out quiet side streets. Their philosophy lines up a lot with my own. I would rather cycle a quiet side street, taking the lane (riding in the middle of the road) where the street is narrow enough that cars can't speed. Making the journey a lot safer.

And so as we start building this route out we encounter the same issue. Some of the side streets are fantastic, smooth, shaded and narrow. Others, while narrow, are extremely rough. All within a block or two of each other:

<div class="not-prose grid grid-cols-3 gap-3 my-8 max-w-4xl mx-auto">
  <figure class="m-0">
    <img src="/bumpy-roads/street-smooth.jpg" alt="Freshly paved block" class="w-full h-56 md:h-80 object-cover rounded border-2" style="border-color: #6BAF6E;" loading="lazy" />
    <figcaption class="text-xs mt-2 font-[var(--font-mono)] text-center tracking-wider uppercase" style="color: #6BAF6E;">● Fresh pavement</figcaption>
  </figure>
  <figure class="m-0">
    <img src="/bumpy-roads/street-patched.jpg" alt="Patched and cracked block" class="w-full h-56 md:h-80 object-cover rounded border-2" style="border-color: #CC8832;" loading="lazy" />
    <figcaption class="text-xs mt-2 font-[var(--font-mono)] text-center tracking-wider uppercase" style="color: #CC8832;">● Patched &amp; cracked</figcaption>
  </figure>
  <figure class="m-0">
    <img src="/bumpy-roads/street-broken.jpg" alt="Broken block shot from the handlebars" class="w-full h-56 md:h-80 object-cover rounded border-2" style="border-color: #A83232;" loading="lazy" />
    <figcaption class="text-xs mt-2 font-[var(--font-mono)] text-center tracking-wider uppercase" style="color: #A83232;">● Broken, avoid</figcaption>
  </figure>
</div>

To compound the issue of trying to find a route, road quality is subjective. One of my bikes is a fat-tire mountain ebike that can handle any road condition. But we're building a set of routes for everyone. From road bikes with skinny tires to cargo bikes carrying children. We need a set of routes that works for everyone. The best way to cut out subjectivity: **Data!**

One weekend I spun up the project with Claude. Giving it a clean prompt I just gave it the problem statement and the technology to use. We'd make a web app at first so we could quickly try it out and put it on my server. I hadn't given it the context of my previous research yet, as I wanted to see what it would produce. From my day job experience I knew it could handle standing up a web app, building the website component and the server side component, even automatically deploying it to my server for me. But how would it use the accelerometer data from my phone? You can think of accelerometer data as a signal just the same as wavelengths from music or speech. With a whole range of ways to process that signal.

It started pretty simple: "just listen to the phone." Basically take the absolute value of all the phone's shaking, subtract the constant pull of gravity, and call what's left "roughness." The obvious issues with that: the phone struggled to tell the difference between a pothole and pedaling. It couldn't tell the difference between the phone being shaken on a rough road and the phone being jerked around while I slowed down for a stop sign.

So next we tried to filter the signal to ignore slower variations. Pedaling is a slow rhythm, about one to two cycles per second. A rough road is much faster, the vibrations live at roughly five to thirty cycles a second. A high-pass filter is basically a way of saying "only let through the fast stuff." That worked better. But on real rides I could still see the algorithm getting confused on long sustained turns, or whenever I braked hard enough that the phone jerked against the handlebar mount.

Claude and I ended up iterating through a few more versions, each one throwing out whatever signal had been fooling the previous one. The one that stuck is a slightly more statistical take. Instead of the standard deviation of the filtered signal (which gets pulled around by big one-off jolts), we take the **Median Absolute Deviation**, or MAD. The median doesn't care about outliers or about a regular rhythm sitting above and below it, so the algorithm reads flat while pedaling is happening, and only spikes when the road actually gets worse. We also added speed normalisation (going slowly makes everything feel smoother, so we scale by the inverse of speed) and a calibration step at the start of every ride. The phone sits in the handlebar mount at whatever angle I happened to clip it in at, so before recording, the app spends three seconds with me holding still and figures out which axis of the phone is pointing up. It uses that to weight vertical bumps higher than horizontal movement, because vertical is where the road lives and horizontal is where pedaling and steering live. There's also a braking detector: if the GPS speed drops more than 2.5 m/s between fixes, I clamp the roughness reading to the pre-braking level, because hard braking jolts the phone against its mount and makes the road look worse than it is.

## Part 3: Back to research

So after Claude had built this very cool algorithm, I thought it was about time to introduce the research paper and see what we could glean from that.

It explained the concepts that they were using in that research paper: the LPC algorithm, and how it was originally invented in the 1960s to help compress phone signals. It's not really a statistical algorithm the way MAD is. It uses a predictive loop to find where the variance is hiding in the signal. Basically, it looks back at the last eight samples and tries to predict what the next sample will be. If you're riding along the road, a lot of the signal is actually pretty predictable. You've got gravity, you've got pedaling, which is a consistent rhythm, which is kind of easy to predict. But when you hit a rough patch of surface, you've suddenly got a whole extra bunch of noise that the filter can't see coming. When you hit a pothole, for example, that's a big unpredictable variation. The "prediction error", meaning the gap between what the filter guessed and what actually happened, *is* the road roughness. A beautiful addition to the project.

I found that actually both algorithms have their pros and cons. MAD is excellent at staying calm through steady vibration and is robust to the occasional weird reading, but because it works on the median, it can miss a short sharp pothole. One big spike across a handful of samples doesn't move the median much. LPC does the opposite. It's great at catching those sparse events, because the prediction model can't see them coming, but the prediction error also picks up on white noise from the sensor itself, which makes it a bit twitchier overall.

And so if you take the geometric mean of both, the square root of MAD × LPC, you end up in a situation where *both* algorithms have to agree that the road is rough before a cell gets coloured red. One algorithm alone isn't enough. That combined reading became the default view on the map.

### Try it: the signal explorer

Rather than make you picture the pipeline, here it is running live. The signal starts playing as soon as the page loads, and every panel animates in sync, raw accelerometer data at the top, then the high-pass and first-difference stages, the MAD and LPC paths side by side, and the combined roughness score at the bottom. Toggle the four components (pedaling, rough surface, pothole, braking) to see each one's signature. Click the little speaker icon next to any stage to hear that signal, signal amplitude controls **pitch**, so pedaling reads as a slow theremin wobble, the rough patch as agitated pitch jitter, and the pothole as a sharp pitch spike.

<iframe
  src="/bumpy-roads/signal-explorer.html"
  title="Bumpy Roads, Signal Processing Pipeline"
  width="100%"
  height="2500"
  style="border: 1px solid rgba(148,163,184,0.2); border-radius: 8px; background: #0F1729; display: block; max-width: 820px; margin: 2rem auto;"
  loading="lazy"
  allow="autoplay"
></iframe>

(If the embed's acting up, [open it in its own tab](/bumpy-roads/signal-explorer.html).)

### Putting it on a map

So we have our reading, but how do we display it on the map? I went for one of the simplest solutions for this. Take the world and divide it into rectangles about 14m × 12m (roughly the length of a small car). While you're riding we're constantly taking measurements, and those measurements get dropped into whichever box you happen to be inside at the time. If a box contains a pothole, it raises that box's roughness score. The boxes are then coloured green to red so you can instantly see where the rough roads are. This approach works and is really easy to implement. The map website simply asks the API: give me all the roughness data in the boxes between these coordinates.

<figure class="not-prose my-6 mx-auto max-w-3xl">
  <img src="/bumpy-roads/map-view.jpg" alt="A zoomed-in view of the community map showing coloured grid cells over Uptown New Orleans" class="w-full rounded border border-gray-800" loading="lazy" />
  <figcaption class="text-xs text-gray-500 mt-2 font-[var(--font-mono)] text-center tracking-wider">Community map, uptown new orleans. Red along the main thoroughfare, greens on the side streets.</figcaption>
</figure>

The downside: these boxes are fixed for this iteration of the map. We could reduce the box size in the future, but that would effectively invalidate the existing aggregates. The boxes don't always align perfectly with the road either, which does mean the data on the map can look a little strange on curves and corners. But at the zoom level the app is built for, picking between one side street and another, the whole block lights up red or green, and you can tell at a glance which way to turn.

## Part 4: Making it useful to the rest of the world

The algorithm and the heatmap were maybe a third of the work. The rest was turning it from a solo tool into something the Bike Streets volunteers could actually use.

**Accounts and bikes.** The first version of the app didn't have logins. Every reading fed a single global map. That's fine when you're the only user, but it falls apart the moment someone else with a different bike wants to help. A road bike with skinny tires and a rigid frame feels everything the road does. A fat-tire ebike eats most of it. If we want to compare apples to apples, the same road has to mean different things depending on whose bike measured it. So I added user accounts, a notion of "bikes" owned by a user, and a per-bike **calibration factor**. The calibration factor is a single number you can dial in by looking at your own ride data on a map and nudging a slider until the colours match what you actually remember feeling that day. It's applied at read time rather than baked into storage, which means you can recalibrate any time without having to reprocess your old rides.

**Personal map vs. community map.** Once there were multiple users I added two views. A personal map that only shows your own rides, which is useful when you're calibrating or you just want to see your own trails. And a community map that rolls everyone's rides up into a single consensus surface. Logged-out visitors land on the community map; logged-in users can toggle between the two. If you delete a ride (which I definitely need from time to time, the occasional test ride that went sideways), the cells it touched get re-aggregated. I learned the hard way early on that if you don't give people a way to prune spikes out of their own history, the map ends up with a permanent red blotch in front of their house where they once dropped the phone into the mount.

**Rough patches, not just averages.** For a while the only summary the app gave you for a route was a single average roughness. Then the Bike Streets team started comparing two candidate paths that came back with basically the same number. In practice, one of them had a block of brutally broken asphalt followed by two smooth miles. The average was fine. The experience was not. So the map now also reports a "rough patches" percentage, what percentage of a given route is above the "very rough" threshold, and how many meters of rough patch it contains. That's the number the team actually argues about now. Route A and Route B might both average the same, but if Route A has 40 meters of rough patches and Route B has 200, that's the one we don't send the cargo bikes down.

**The route measure tool.** This was the piece that closed the loop back to the original problem. You can drop waypoints on the map and the tool walks the line through every grid cell it crosses, pulls out the readings, and tells you the average roughness, the standard deviation, the rough-patch percentage and the rough-patch meters for that exact route. Then you can draw a second candidate route and it shows you both side by side. This is the bit that lets us actually plan a cross-town bike route instead of just looking at a pretty heatmap. Drawing two routes from my house to Mid-City and watching the numbers update in real time feels oddly close to the thing I originally imagined on the handlebars.

## Where it is now

The app is live, it runs on my own server, and a handful of us on the Bike Streets team have been feeding it rides on different bikes. Between us we've covered a solid chunk of Uptown and the surrounding neighbourhoods, and the map is now dense enough that I can plan a new route on it and trust the colours.

There's still a pile of things I'd like to do:

- **Distribution per cell, not just a mean.** "Consistently mediocre" and "mostly fine with one pothole" currently look identical. I'd like each cell to store a rough distribution so the map can separate those two.
- **Historical tracking.** New Orleans actually *does* repave. Blocks that were brutal six months ago are smooth now. The current aggregate silently averages across time, which means a newly-paved block keeps showing up red for a while. I want to give the cells a timeline so the map reflects the road as it is today, not as it was a year ago.
- **City data tie-in.** 311 reports, road maintenance schedules, any official road condition survey we can get our hands on. Cross-referencing our crowdsourced roughness against any of that would be a useful sanity check, and potentially something worth sending back to the city.

## What I actually took away from this

This is the first non-trivial thing I've ever built that leaned on maths I don't really understand. Two years ago I read the SmartRoadSense paper, decided it was out of reach, and shelved it. The *exact same paper* this year was doable on a long weekend. Not because the maths got any easier. It was because I had someone in the loop who could read the paper with me, explain the Levinson-Durbin recursion three different ways until I actually got it, and then write the implementation while I watched and asked questions. The bit that surprised me wasn't that Claude could write the code. It was that I stopped being allergic to the research.

The other takeaway: start with the dumbest possible version of the algorithm. "Absolute value minus gravity" is nonsense as a roughness metric, but riding around with it on my phone taught me more about the problem, about pedaling cadence, about braking jolts, about the fact that the phone sits at a weird angle in the mount, than any amount of reading would have. Pretty much every later fix in the git history corresponds to a specific ride where the previous version was embarrassingly wrong about something I could now name. The research paper was useful, but only once I already knew what I was looking at.

If you're in New Orleans and you ride, come find me. The app is free and the more bikes on it the sharper the map gets.
