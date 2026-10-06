#!/usr/bin/env node
// Static build: no dependencies. `node build.mjs` writes dist/.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { FAQ, FEATURES, PAGES, POSTS, SITE } from "./src/site.mjs";

const OUT = "dist";
const today = new Date().toISOString().slice(0, 10);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => SITE.url + p;
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

const ORG_ID = `${SITE.url}/#organization`;
const org = {
  "@type": "Organization", "@id": ORG_ID, name: SITE.name, url: SITE.url,
  logo: { "@type": "ImageObject", url: abs("/icon-512.png"), width: 512, height: 512 },
  email: SITE.email, sameAs: Object.values(SITE.social),
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE.email },
};
const website = { "@type": "WebSite", "@id": `${SITE.url}/#website`, name: SITE.name, url: SITE.url, description: SITE.description, inLanguage: "en", publisher: { "@id": ORG_ID } };
const app = {
  "@type": "MobileApplication", "@id": `${SITE.url}/#app`, name: SITE.name, url: SITE.url,
  applicationCategory: "LifestyleApplication", operatingSystem: "iOS, Android",
  description: SITE.description, image: abs("/img/og.jpg"), screenshot: [abs("/img/app-all-recipes.webp"), abs("/img/app-recipe-details.webp")],
  installUrl: [SITE.stores.ios, SITE.stores.android], publisher: { "@id": ORG_ID }, inLanguage: "en",
};
const crumbs = (items) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })) });

function layout({ path, title, description, body, graph = [], type = "website", published, noindex = false, preloadHero = false }) {
  const canonical = abs(path === "/" ? "/" : path);
  const nav = [["/", "Home"], ["/blog", "Blog"], ["/about", "About"], ["/contact", "Contact"], ["/privacy-policy", "Privacy"]];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="${SITE.themeColor}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs("/img/og.jpg")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A family cooking together in a kitchen">
${published ? `<meta property="article:published_time" content="${published}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/styles.css">
${preloadHero ? '<link rel="preload" as="image" href="/img/hero-800.webp" imagesrcset="/img/hero-800.webp 800w, /img/hero.webp 1600w" imagesizes="(min-width: 960px) 960px, 100vw">' : ""}
${graph.length ? ld({ "@context": "https://schema.org", "@graph": graph }) : ""}
${SITE.analyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.analyticsId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${SITE.analyticsId}")</script>` : ""}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="/"><img src="/img/logo.png" width="32" height="32" alt="">${esc(SITE.name)}</a>
  <nav aria-label="Main"><ul>${nav.map(([p, l]) => `<li><a href="${p}"${p === path ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}</ul></nav>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div>
    <p><strong>${esc(SITE.name)}</strong><br>${esc(SITE.tagline)}.</p>
    <p class="stores">${storeBadges()}</p>
  </div>
  <div>
    <p><a href="/blog">Blog</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/privacy-policy">Privacy Policy</a></p>
    <p><a href="${SITE.social.facebook}" rel="me noopener">Facebook</a> · <a href="${SITE.social.pinterest}" rel="me noopener">Pinterest</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></p>
    <p class="small">© ${new Date().getFullYear()} ${esc(SITE.name)}. All rights reserved.</p>
  </div>
</footer>
</body>
</html>
`;
}

function storeBadges() {
  return `<a href="${SITE.stores.ios}" rel="noopener"><img src="/img/badge-app-store.png" width="160" height="53" loading="lazy" alt="Download Grandma's Recipes on the App Store"></a> <a href="${SITE.stores.android}" rel="noopener"><img src="/img/badge-google-play.png" width="160" height="53" loading="lazy" alt="Get Grandma's Recipes on Google Play"></a>`;
}

const pages = [];
const add = (path, html) => pages.push({ path, html });

// ── Home
{
  const p = PAGES.home;
  const body = `<section class="hero">
  <img src="/img/hero.webp" srcset="/img/hero-800.webp 800w, /img/hero.webp 1600w" sizes="(min-width: 960px) 960px, 100vw" width="1600" height="872" fetchpriority="high" alt="A family cooking together in a bright kitchen">
  <div class="hero-text">
    <h1>${esc(SITE.name)}</h1>
    <p class="answer"><strong>${esc(SITE.name)} is a recipe app for iPhone and Android</strong> that keeps your family's recipes in one place. Scan handwritten cards, import recipes from websites, type your own or create one with AI, then share them and build recipe books together.</p>
    <p class="stores">${storeBadges()}</p>
  </div>
</section>
<section class="wrap">
  <h2>Save your recipes</h2>
  <ul class="cards">${FEATURES.slice(0, 4).map((f) => `<li><img src="/img/${f.img}" width="${f.w}" height="${f.h}" loading="lazy" alt="${esc(f.alt)}"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join("")}</ul>
  <h2>Share your recipes</h2>
  <p>Cooking is better together.</p>
  <ul class="cards two">${FEATURES.slice(4).map((f) => `<li><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join("")}</ul>
  <h2>See the app</h2>
  <div class="shots">
    <img src="/img/app-all-recipes.webp" width="540" height="1141" loading="lazy" alt="The All Recipes screen listing recipes such as Chocolate Chip Cookies and Homemade Sourdough Bread">
    <img src="/img/app-recipe-details.webp" width="540" height="1141" loading="lazy" alt="A recipe detail screen for Greek Lemon Chicken showing servings, prep time, cook time and tags">
  </div>
  <h2 id="faq">Questions about Grandma's Recipes</h2>
  <div class="faq">${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</div>
  <h2>From the blog</h2>
  <ul class="links">${POSTS.map((x) => `<li><a href="/${x.slug}">${esc(x.h1)}</a></li>`).join("")}</ul>
</section>`;
  add("/", layout({ ...p, body, preloadHero: true, graph: [org, website, app, {
    "@type": "WebPage", "@id": `${SITE.url}/#webpage`, url: SITE.url, name: p.title, isPartOf: { "@id": website["@id"] }, about: { "@id": app["@id"] }, primaryImageOfPage: abs("/img/og.jpg"), dateModified: today,
  }, { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] }));
}

// ── Blog index + posts
{
  const p = PAGES.blog;
  const body = `<article class="wrap prose">
  <h1>Cherished Family Recipes</h1>
  <p class="answer">Stories and tips for capturing, sharing and cooking the recipes your family has loved for generations.</p>
  <ul class="posts">${POSTS.map((x) => `<li><h2><a href="/${x.slug}">${esc(x.h1)}</a></h2><p class="meta"><time datetime="${x.published}">${fmtDate(x.published)}</time></p><p>${esc(x.description)}</p></li>`).join("")}</ul>
  <h2>Get in touch</h2>
  <p>We'd love to hear your recipe stories and experiences. <a class="button" href="/contact">Send us your recipe suggestions</a></p>
</article>`;
  add("/blog", layout({ ...p, body, graph: [org, website, crumbs([["Home", "/"], ["Blog", "/blog"]]), { "@type": "Blog", name: "Cherished Family Recipes", url: abs("/blog"), publisher: { "@id": ORG_ID }, blogPost: POSTS.map((x) => ({ "@type": "BlogPosting", headline: x.h1, url: abs("/" + x.slug), datePublished: x.published })) }] }));
}
function fmtDate(d) { return new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" }); }
for (const x of POSTS) {
  const body = `<article class="wrap prose">
  <p class="crumbs"><a href="/">Home</a> › <a href="/blog">Blog</a></p>
  <h1>${esc(x.h1)}</h1>
  <p class="meta"><time datetime="${x.published}">${fmtDate(x.published)}</time> · 1 min read</p>
  <p class="answer">${esc(x.lead)}</p>
  ${x.sections.map(([h, t]) => `<h2>${esc(h)}</h2><p>${esc(t)}</p>`).join("\n  ")}
  <p><a class="button" href="${SITE.stores.ios}" rel="noopener">Get it on the App Store</a> <a class="button alt" href="${SITE.stores.android}" rel="noopener">Get it on Google Play</a></p>
</article>`;
  add("/" + x.slug, layout({ path: "/" + x.slug, title: x.title, description: x.description, body, type: "article", published: x.published, graph: [org, website, crumbs([["Home", "/"], ["Blog", "/blog"], [x.title, "/" + x.slug]]), {
    "@type": "BlogPosting", headline: x.h1, description: x.description, url: abs("/" + x.slug), mainEntityOfPage: abs("/" + x.slug), datePublished: x.published, dateModified: x.published,
    image: abs("/img/og.jpg"), author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, inLanguage: "en",
  }] }));
}

// ── About
{
  const p = PAGES.about;
  const body = `<article class="wrap prose">
  <h1>About Grandma's Recipes</h1>
  <p class="answer"><strong>Grandma's Recipes is an independent recipe app built by Neil Schwalb</strong> to keep family recipes safe, easy to find and easy to share.</p>
  <h2>What it does</h2>
  <p>The app turns the recipes your family already has into a digital collection. You can scan handwritten cards, import recipes from websites, type or dictate your own, or create a recipe with AI. Recipes can be shared one at a time, or gathered into recipe books with the people you cook with.</p>
  <h2>Why it exists</h2>
  <p>Family recipes are easy to lose: a card goes missing, a note fades, a favorite lives only in someone's head. The goal is simple. Make it quick to save a recipe, and just as quick to hand it to the next person.</p>
  <h2>Get the app</h2>
  <p class="stores">${storeBadges()}</p>
  <h2>Contact</h2>
  <p>Questions, feedback or a recipe story to share? <a href="/contact">Get in touch</a>.</p>
</article>`;
  add("/about", layout({ ...p, body, graph: [org, website, crumbs([["Home", "/"], ["About", "/about"]]), { "@type": "AboutPage", url: abs("/about"), name: p.title, about: { "@id": ORG_ID } }] }));
}

// ── Contact
{
  const p = PAGES.contact;
  const mail = (subject, text) => `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  const body = `<article class="wrap prose">
  <h1>Contact Grandma's Recipes</h1>
  <p class="answer">Email <a href="mailto:${SITE.email}">${SITE.email}</a> with any question, concern or recipe suggestion. We read every message.</p>
  <h2>Email</h2>
  <p><a class="button" href="mailto:${SITE.email}">${SITE.email}</a></p>
  <h2>Deletion requests</h2>
  <p>To delete your account or your data, send us a request. These links open an email that is ready to send from the address on your account.</p>
  <ul class="links">
    <li><a href="${mail("Delete my Grandma's Recipes account", "Please delete my Grandma's Recipes account.\n\nAccount email: ")}">Delete account</a></li>
    <li><a href="${mail("Delete my Grandma's Recipes data", "Please delete the data you hold about me.\n\nAccount email: ")}">Delete data</a></li>
  </ul>
  <h2>Follow along</h2>
  <p><a href="${SITE.social.facebook}" rel="me noopener">Facebook</a> · <a href="${SITE.social.pinterest}" rel="me noopener">Pinterest</a></p>
</article>`;
  add("/contact", layout({ ...p, body, graph: [org, website, crumbs([["Home", "/"], ["Contact", "/contact"]]), { "@type": "ContactPage", url: abs("/contact"), name: p.title, about: { "@id": ORG_ID } }] }));
}

// ── Privacy (text carried over verbatim from the previous site)
{
  const p = PAGES.privacy;
  const items = JSON.parse(readFileSync("src/privacy.json", "utf8"));
  let html = "", list = false;
  for (const [tag, text] of items) {
    if (tag !== "li" && list) { html += "</ul>"; list = false; }
    if (tag === "li") { if (!list) { html += "<ul>"; list = true; } html += `<li>${esc(text)}</li>`; }
    else if (tag.startsWith("h")) html += `<h2>${esc(text.replace(/:$/, ""))}</h2>`;
    else html += `<p>${esc(text)}</p>`;
  }
  if (list) html += "</ul>";
  const body = `<article class="wrap prose"><h1>Privacy Policy</h1>${html}</article>`;
  add("/privacy-policy", layout({ ...p, body, graph: [org, website, crumbs([["Home", "/"], ["Privacy Policy", "/privacy-policy"]])] }));
}

// ── 404 (not in sitemap, noindex)
const notFound = layout({ path: "/404", title: "Page not found | Grandma's Recipes", description: "That page does not exist. Head back to the Grandma's Recipes home page or the blog.", noindex: true,
  body: `<article class="wrap prose"><h1>Page not found</h1><p>That page does not exist. Try the <a href="/">home page</a> or the <a href="/blog">blog</a>.</p></article>` });

// ── write
rmSync(OUT, { recursive: true, force: true });
cpSync("public", OUT, { recursive: true });
cpSync("src/styles.css", join(OUT, "styles.css"));
const put = (rel, text) => { mkdirSync(dirname(join(OUT, rel)), { recursive: true }); writeFileSync(join(OUT, rel), text); };
for (const pg of pages) put(pg.path === "/" ? "index.html" : `${pg.path.slice(1)}/index.html`, pg.html);
put("404.html", notFound);

put("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((pg) => `  <url><loc>${abs(pg.path)}</loc><lastmod>${(POSTS.find((x) => "/" + x.slug === pg.path)?.published) ?? today}</lastmod></url>`).join("\n")}\n</urlset>\n`);

const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];
put("robots.txt", `User-agent: *\nAllow: /\n\n${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\n`).join("\n")}\nSitemap: ${abs("/sitemap.xml")}\n`);

put("llms.txt", `# ${SITE.name}

> ${SITE.description}

${SITE.name} is available on iPhone (Apple App Store) and Android (Google Play).

## Key pages
- [Home](${abs("/")}): What the app does, screenshots and frequently asked questions
- [Blog](${abs("/blog")}): Stories and tips on saving and sharing family recipes
${POSTS.map((x) => `- [${x.h1}](${abs("/" + x.slug)}): ${x.description}`).join("\n")}
- [About](${abs("/about")}): Who makes the app and why
- [Contact](${abs("/contact")}): Email support, feedback and account or data deletion requests
- [Privacy Policy](${abs("/privacy-policy")}): What data is collected and your rights

## Download
- [App Store](${SITE.stores.ios})
- [Google Play](${SITE.stores.android})
`);
console.log(`built ${pages.length} pages + 404 → ${OUT}/`);
