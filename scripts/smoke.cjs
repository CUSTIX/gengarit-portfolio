// End-to-end smoke test: builds nothing itself — run `npm run build` first.
// Serves dist/ with `vite preview`, drives it in headless Chromium, and
// fails on console errors, missing sections, broken interactions, or
// horizontal overflow on a phone-sized viewport.
//
//   npm run test:e2e
//
// Chromium: uses Playwright's bundled browser if `npx playwright install
// chromium` was run, or set CHROME_PATH to any Chrome/Chromium executable.

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright-core");

const PORT = 4173;
const URL = `http://localhost:${PORT}/`;

const findChrome = () => {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  // Playwright's browser cache (Windows / Linux / macOS layouts)
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
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];
  return candidates.find((c) => fs.existsSync(c));
};

const waitFor = async (url, ms = 20000) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`preview server did not start on ${url}`);
};

const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failures.push(label);
};

(async () => {
  const exe = findChrome();
  if (!exe) throw new Error("No Chromium found. Set CHROME_PATH or run `npx playwright install chromium`.");

  const server = spawn(`npx vite preview --port ${PORT} --strictPort`, { stdio: "ignore", shell: true });
  try {
    await waitFor(URL);
    const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

    // ---- desktop ----
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(3500);

    for (const id of ["top", "about", "stack", "work", "path", "contact"]) {
      check(await page.$(`#${id}`), `section #${id} present`);
    }
    check(await page.$("#top canvas"), "3D hero mark mounted (WebGL)");

    await page.keyboard.press("Control+k");
    await page.waitForTimeout(400);
    await page.keyboard.type("dep");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1200);
    const pathTop = await page.evaluate(() => Math.round(document.getElementById("path").getBoundingClientRect().top));
    check(Math.abs(pathTop - 88) <= 4, `palette jumps to #path under the nav (top=${pathTop}px)`);

    const row = page.locator('button[aria-controls="archive-panel"]').nth(1);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    await page.waitForTimeout(900);
    check(await page.evaluate(() => /DHSUD HOA CDD/.test(document.getElementById("archive-panel").textContent)), "archive row opens its detail panel");

    await page.click('button[aria-controls="cx-assistant"]');
    await page.waitForTimeout(600);
    check(await page.$("#cx-assistant"), "assistant panel opens");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    check(!(await page.$("#cx-assistant")), "assistant closes on Escape");

    check(errors.length === 0, `no console/page errors on desktop${errors.length ? `: ${errors[0]}` : ""}`);

    // ---- deep link (fresh context, so the intro plays first) ----
    const dp = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await dp.goto(`${URL}#work`, { waitUntil: "networkidle" });
    await dp.waitForTimeout(4500);
    const workTop = await dp.evaluate(() => Math.round(document.getElementById("work").getBoundingClientRect().top));
    check(Math.abs(workTop - 88) <= 4, `deep link /#work lands under the nav after the intro (top=${workTop}px)`);
    await dp.close();

    // ---- phone ----
    const mp = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const merrors = [];
    mp.on("pageerror", (e) => merrors.push(e.message));
    await mp.goto(URL, { waitUntil: "networkidle" });
    await mp.waitForTimeout(3500);
    await mp.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(overflow === 0, `no horizontal overflow on phone (${overflow}px)`);
    await mp.click('button[aria-controls="mobile-nav"]');
    await mp.waitForTimeout(400);
    check(await mp.$("#mobile-nav"), "mobile menu opens");
    await mp.keyboard.press("Escape");
    await mp.waitForTimeout(300);

    // archive: no side panel on phones; the detail expands under the tapped row
    check(!(await mp.$("#archive-panel")), "phone archive has no empty side panel");
    const prow = mp.locator("#archive-row-2");
    await prow.scrollIntoViewIfNeeded();
    await prow.tap();
    await mp.waitForTimeout(1000);
    const inline = await mp.evaluate(() => {
      const d = document.getElementById("archive-detail-2");
      return d ? { h: Math.round(d.getBoundingClientRect().height), ok: /Offline Server Architecture/.test(d.textContent) } : null;
    });
    check(inline && inline.ok && inline.h > 300, `phone archive row expands inline (${inline ? inline.h : 0}px)`);
    check(merrors.length === 0, `no page errors on phone${merrors.length ? `: ${merrors[0]}` : ""}`);

    await browser.close();
  } finally {
    server.kill();
  }

  if (failures.length) {
    console.error(`\n${failures.length} check(s) failed`);
    process.exit(1);
  }
  console.log("\nall checks passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
