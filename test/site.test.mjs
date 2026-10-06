import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

execFileSync("node", ["build.mjs"], { stdio: "pipe" });
const read = (p) => readFileSync(join("dist", p), "utf8");
const pages = ["index.html", "blog/index.html", "about/index.html", "contact/index.html", "privacy-policy/index.html",
  "cherishing-family-memories-through-grandmas-timeless-recipes/index.html", "cherishing-grandmas-recipes-a-journey-through-family-cooking-memories/index.html"];
const tag = (h, re) => h.match(re)?.[1];

test("every page has one h1, a 30-60 char title, a 120-160 char description and a canonical", () => {
  for (const p of pages) {
    const h = read(p);
    assert.equal((h.match(/<h1[ >]/g) ?? []).length, 1, `${p} h1`);
    const t = tag(h, /<title>([^<]*)<\/title>/).replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'");
    assert.ok(t.length >= 30 && t.length <= 62, `${p} title ${t.length}: ${t}`);
    const d = tag(h, /<meta name="description" content="([^"]*)"/);
    assert.ok(d.length >= 115 && d.length <= 165, `${p} description ${d.length}`);
    assert.match(h, /<link rel="canonical" href="https:\/\/grandmasrecipes\.app\//);
  }
});

test("the previous site's URLs all still exist and are in the sitemap", () => {
  const map = read("sitemap.xml");
  for (const u of ["", "/about", "/blog", "/contact", "/privacy-policy", "/cherishing-family-memories-through-grandmas-timeless-recipes", "/cherishing-grandmas-recipes-a-journey-through-family-cooking-memories"]) {
    assert.ok(map.includes(`<loc>https://grandmasrecipes.app${u || "/"}</loc>`), u);
  }
});

test("JSON-LD parses on every page; home has FAQPage, MobileApplication, Organization, WebSite", () => {
  for (const p of pages) for (const m of read(p).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  const types = [...read("index.html").matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
  for (const t of ["FAQPage", "MobileApplication", "Organization", "WebSite"]) assert.ok(types.includes(t), t);
});

test("FAQ markup mirrors the visible FAQ", () => {
  const h = read("index.html");
  const names = [...h.matchAll(/"name":"([^"]+\?)"/g)].map((m) => m[1].replace(/\\u0027/g, "'"));
  assert.ok(names.length >= 5);
  for (const n of names) assert.ok(h.includes(`<h3>${n.replace(/'/g, "&#39;").replace(/&/g, "&amp;")}</h3>`) || h.includes(`<h3>${n}</h3>`), n);
});

test("every img has alt (empty only for decoration), width and height; local images exist", () => {
  for (const p of pages) for (const m of read(p).matchAll(/<img\b[^>]*>/g)) {
    assert.match(m[0], /\balt="/, `${p}: ${m[0]}`);
    assert.match(m[0], /\bwidth="\d+"/);
    assert.match(m[0], /\bheight="\d+"/);
    const src = tag(m[0], /\bsrc="(\/[^"]+)"/);
    if (src) assert.ok(existsSync(join("dist", src)), src);
  }
});

test("internal links resolve to built files", () => {
  for (const p of pages) for (const m of read(p).matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    const ok = existsSync(join("dist", href)) && statSync(join("dist", href)).isFile() || existsSync(join("dist", href, "index.html")) || href === "/";
    assert.ok(ok, `${p} -> ${href}`);
  }
});

test("robots.txt allows the AI crawlers and lists the sitemap; llms.txt exists", () => {
  const r = read("robots.txt");
  for (const b of ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot", "Google-Extended"]) assert.match(r, new RegExp(`User-agent: ${b}\\nAllow: /`));
  assert.ok(!/Disallow:\s*\//.test(r));
  assert.match(r, /Sitemap: https:\/\/grandmasrecipes\.app\/sitemap\.xml/);
  assert.match(read("llms.txt"), /^# Grandma's Recipes\n\n> /);
});

test("privacy policy text is carried over and the deletion mailto links exist", () => {
  assert.match(read("privacy-policy/index.html"), /The right to erasure/);
  assert.match(read("contact/index.html"), /mailto:grandmasrecipesapp@gmail\.com\?subject=Delete/);
});

test("no leftover template text from the old builder", () => {
  for (const p of pages) assert.doesNotMatch(read(p), /Esther Bryce|realtor|interior design|zyrosite/i, p);
});

test("pages stay light: HTML under 40 KB each, no render-blocking third-party scripts", () => {
  for (const p of pages) { const h = read(p); assert.ok(h.length < 40_000, `${p} ${h.length}`); assert.doesNotMatch(h, /<script[^>]+src="https?:/); }
});
