# My Personal Website

This is my personal website, showcasing my portfolio and blog. It's built with the Kross Jekyll Creative Portfolio Template.

## Setup

To start your project, fork this repository
After forking the repo, your site will be live immediately on your personal Github Pages account, e.g. `https://yourusername.github.io/your-repo-name/`.

Make sure GitHub Pages is enabled for your repo. It might take some time for the site to propagate entirely.

## Customize

Things you can customize in `_data/settings.yml` (no HTML/CSS):

- Theme General Settings ( name, logo, email, phone, address )
- Hero Section
- About Section
- Team Section
- Skills Section
- Experience Section
- Education Section
- Services Section
- Portfolio Section
- Testimonials Section
- Client Slider Section
- Contact Section

## Local Development

### Standard Jekyll Development
To run the site locally, navigate to the theme directory and run:
```bash
bundle install
bundle exec jekyll serve
```

### Docker Development (Recommended)
For a consistent development environment, use Docker:
```bash
docker-compose up
```
This will build and serve the site at `http://localhost:4000`.

## Deployment

The site is configured for GitHub Pages deployment. Any push to the main branch will automatically deploy the site.

For other deployment methods, check the [Deployment Methods](https://jekyllrb.com/docs/deployment-methods/) page on Jekyll's website.

**Code License:** Released under the [MIT](https://github.com/themefisher/kross-jekyll/blob/main/LICENSE) license.

