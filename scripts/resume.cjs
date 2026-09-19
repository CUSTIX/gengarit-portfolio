// Generates a one-page PDF résumé from the same data that drives the site
// (src/constants/index.js), so the two never drift apart.
//
//   npm run resume        -> public/resume-custix.pdf
//
// Chromium is resolved the same way as the smoke test (CHROME_PATH or
// Playwright's browser cache).

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright-core");

const OUT = path.resolve(__dirname, "../public/resume-custix.pdf");

const findChrome = () => {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const caches = [
    [path.join(os.homedir(), "AppData/Local/ms-playwright"), "chrome-win/chrome.exe"],
    [path.join(os.homedir(), ".cache/ms-playwright"), "chrome-linux/chrome"],
    [path.join(os.homedir(), "Library/Caches/ms-playwright"), "chrome-mac/Chromium.app/Contents/MacOS/Chromium"],
  ];
  for (const [cache, bin] of caches) {
    if (!fs.existsSync(cache)) continue;
    const dir = fs.readdirSync(cache).find((d) => d.startsWith("chromium-") && !d.includes("headless"));
    if (dir && fs.existsSync(path.join(cache, dir, bin))) return path.join(cache, dir, bin);
  }
  return null;
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const render = (c) => {
  const { BRAND, ABOUT_DATA, FEATURED_PROJECT, PROJECTS, TIMELINE, LANGUAGES, FRAMEWORKS, TOOLS, SOCIAL_LINKS } = c;
  const systems = [
    { title: FEATURED_PROJECT.title, subtitle: FEATURED_PROJECT.subtitle, impact: FEATURED_PROJECT.impact, tags: FEATURED_PROJECT.tags },
    ...PROJECTS.map((p) => ({ title: p.title, subtitle: p.subtitle, impact: p.impact, tags: p.tags })),
  ];
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 12mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: "Sora", system-ui, sans-serif; color: #111827; font-size: 9.2pt; line-height: 1.42; }
  .mono { font-family: "JetBrains Mono", monospace; letter-spacing: .14em; text-transform: uppercase; font-size: 7.2pt; color: #2563eb; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1.5px solid #0b1020; padding-bottom: 8px; }
  h1 { font-size: 22pt; font-weight: 800; letter-spacing: -.03em; color: #05070c; }
  h1 span { color: #2563eb; }
  .role { margin-top: 2px; font-weight: 600; color: #1f2937; }
  .contact { text-align: right; font-size: 8.4pt; color: #374151; line-height: 1.6; }
  .contact a { color: #2563eb; text-decoration: none; }
  h2 { margin: 12px 0 6px; font-size: 8pt; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: #2563eb; }
  p.sum { color: #374151; }
  .grid { display: grid; grid-template-columns: 1.55fr 1fr; gap: 16px; }
  .item { margin-bottom: 7px; page-break-inside: avoid; }
  .item .t { display: flex; justify-content: space-between; gap: 10px; font-weight: 700; color: #0b1020; }
  .item .s { font-size: 8.2pt; color: #4b5563; }
  .item .i { margin-top: 2px; color: #374151; }
  .tags { margin-top: 3px; display: flex; flex-wrap: wrap; gap: 3px; }
  .tag { border: 1px solid #d1d5db; border-radius: 999px; padding: 1px 6px; font-family: "JetBrains Mono", monospace; font-size: 6.8pt; color: #374151; }
  ul { padding-left: 14px; color: #374151; }
  li { margin-bottom: 2px; }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip { background: #eff6ff; color: #1e3a8a; border-radius: 999px; padding: 2px 8px; font-size: 8pt; }
  footer { margin-top: 8px; border-top: 1px solid #e5e7eb; padding-top: 5px; font-family: "JetBrains Mono", monospace; font-size: 6.8pt; letter-spacing: .16em; color: #6b7280; display: flex; justify-content: space-between; }
</style></head><body>
<header>
  <div>
    <div class="mono">${esc(BRAND.name)} · ${esc(BRAND.role)}</div>
    <h1>${esc(BRAND.fullName)}</h1>
    <div class="role">${esc(ABOUT_DATA.title)} · ${esc(BRAND.location)}</div>
  </div>
  <div class="contact">
    ${SOCIAL_LINKS.map((s) => `<div><a href="${esc(s.url)}">${esc(s.url.replace(/^https?:\/\/(www\.)?/, ""))}</a></div>`).join("")}
  </div>
</header>

<h2>Profile</h2>
<p class="sum">${esc(ABOUT_DATA.bio)} ${esc(ABOUT_DATA.philosophy)}</p>

<div class="grid">
  <div>
    <h2>Selected systems</h2>
    ${systems
      .map(
        (s) => `<div class="item">
      <div class="t"><span>${esc(s.title)}</span></div>
      <div class="s">${esc(s.subtitle)}</div>
      <div class="i">${esc(s.impact)}</div>
      <div class="tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </div>`
      )
      .join("")}
  </div>
  <div>
    <h2>Experience &amp; education</h2>
    ${TIMELINE.map(
      (t) => `<div class="item">
      <div class="t"><span>${esc(t.role)}</span><span class="s">${esc(t.period)}</span></div>
      <div class="s">${esc(t.org)}</div>
      ${t.description ? `<div class="i">${esc(t.description)}</div>` : ""}
      ${t.awards ? `<ul>${t.awards.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
    </div>`
    ).join("")}
    <h2>Languages</h2><div class="chips">${LANGUAGES.map((l) => `<span class="chip">${esc(l.name)}</span>`).join("")}</div>
    <h2>Frameworks</h2><div class="chips">${FRAMEWORKS.map((f) => `<span class="chip">${esc(f.name)}</span>`).join("")}</div>
    <h2>Tools &amp; services</h2><div class="chips">${TOOLS.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    <h2>Capabilities</h2><ul>${ABOUT_DATA.capabilities.map((c) => `<li>${esc(c.value)}</li>`).join("")}</ul>
  </div>
</div>
<footer><span>GENERATED FROM THE PORTFOLIO DATA · ${new Date().toISOString().slice(0, 10)}</span><span>${esc(BRAND.name)} © ${BRAND.year}</span></footer>
</body></html>`;
};

(async () => {
  const exe = findChrome();
  if (!exe) throw new Error("No Chromium found. Set CHROME_PATH or run `npx playwright install chromium`.");
  const constants = await import(pathToFileURL(path.resolve(__dirname, "../src/constants/index.js")).href);
  const browser = await chromium.launch({ executablePath: exe, headless: true });
  const page = await browser.newPage();
  await page.setContent(render(constants), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: OUT, format: "A4", printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log("wrote", path.relative(process.cwd(), OUT), fs.statSync(OUT).size, "bytes");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
