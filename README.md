# adamdavies.dev

Personal portfolio and blog built with Astro and Tailwind CSS.

## Tech Stack

- **Framework:** [Astro](https://astro.build)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Typography:** [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Deployment:** GitHub Pages

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Button, Card, etc.
│   ├── terminal/   # TerminalWindow, Cursor, Prompt
│   ├── layout/     # Header, Footer, ThemeToggle
│   ├── sections/   # Hero, About, BlogPreview
│   └── effects/    # GlitchText, FloatingCode
├── content/        # Markdown content
│   ├── blog/       # Blog posts
│   └── projects/   # Project entries
├── data/           # Site configuration
├── layouts/        # Page layouts
├── pages/          # Route pages
└── styles/         # Global CSS and design tokens
```

## Adding Content

### Blog Posts

Add a new `.md` file to `src/content/blog/`:

```yaml
---
title: "Your Post Title"
subtitle: "Optional subtitle"
date: 2025-01-01
image: /images/blog/your-image.png
tags: [tag1, tag2]
author: Adam Davies
---

Your content here...
```

### Projects

Add a new `.md` file to `src/content/projects/`:

```yaml
---
title: "Project Name"
description: "Short description"
emoji: "🚀"
link: "https://example.com"
github: "https://github.com/user/repo"
tags: [TypeScript, React]
featured: true
order: 1
---

Optional longer description...
```

## Deployment

The site automatically deploys to GitHub Pages when pushing to `main`.
