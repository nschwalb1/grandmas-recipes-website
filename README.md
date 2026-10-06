# Grandma's Recipes website

Static marketing site for the Grandma's Recipes app (https://grandmasrecipes.app). No dependencies, no framework.

```bash
npm run build   # writes dist/
npm test        # builds, then checks titles, descriptions, JSON-LD, links, alt text, robots/llms
```

- `src/site.mjs`: site facts, FAQ, features, blog posts, per-page title/description. Edit here.
- `build.mjs`: renders every page, `sitemap.xml`, `robots.txt` (AI crawlers allowed) and `llms.txt` from that data.
- `public/`: images, icons. Copied as-is.
- `src/privacy.json`: privacy policy text, carried over word for word from the previous site.

## Deploy

Any static host: build command `npm run build`, output directory `dist`. `vercel.json` sets clean URLs (no `.html`) and cache headers. URLs match the old Hostinger site exactly, so nothing needs a redirect.

Analytics are off. To turn on GA4, build with `GA_ID=G-XXXXXXX` (add a consent banner first if you need one).

## SEO / AEO

Per page: unique title and description, canonical, Open Graph, one H1, BreadcrumbList. Home also has Organization, WebSite, MobileApplication and FAQPage JSON-LD (the FAQ is visible on the page and mirrored in the markup). Posts have BlogPosting JSON-LD. No ratings or reviews are marked up.
