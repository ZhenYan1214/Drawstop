// Records the live website (and one Etherscan page) as clips of JPEG frames via the Chrome DevTools screencast,
// 1920x1080. Read-only: it only scrolls and clicks the site's own controls; nothing is sent on-chain.
// Usage: node record.js [clip ...]   (no argument: every clip). Writes clips/<name>/ (frames + frames.json).
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const SITE = process.env.SITE || "https://zhenyan1214.github.io/Drawstop/";
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const AMS_TX = "https://sepolia.etherscan.io/tx/0xfd78a1e72de6589e2dd1dda06b23b19219d9811de464011d0d4e437e10f1743e";
const CLIPS = path.join(__dirname, "clips");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let page, cdp, current = null;
async function start(name) {
  const dir = path.join(CLIPS, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  current = { name, dir, frames: [] };
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  await sleep(300);
}
async function stop() {
  await sleep(600);
  await cdp.send("Page.stopScreencast");
  fs.writeFileSync(path.join(current.dir, "frames.json"), JSON.stringify(current));
  console.log(`clip ${current.name}: ${current.frames.length} frames, ${(current.frames.at(-1).t - current.frames[0].t).toFixed(1)} s`);
  current = null;
}

async function ring(locator) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.evaluate(({ x, y }) => {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;left:${x - 24}px;top:${y - 24}px;width:48px;height:48px;border-radius:50%;border:4px solid #a3271d;background:rgba(163,39,29,.14);z-index:99999;pointer-events:none`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
  await sleep(450);
}
async function click(locator) {
  await ring(locator);
  await locator.click();
}
async function scrollTo(y, ms = 1400) {
  const from = await page.evaluate(() => window.scrollY);
  const steps = Math.max(1, Math.round(ms / 33));
  for (let i = 1; i <= steps; i++) {
    const k = i / steps, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // ease in-out
    await page.evaluate((v) => window.scrollTo(0, v), from + (y - from) * e);
    await sleep(33);
  }
}
const topOf = (sel, offset = 0) => page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + window.scrollY - o, [sel, offset]);
const home = async () => { await page.goto(SITE, { waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready); await sleep(500); };
const next = () => click(page.locator("#next"));

const clips = {
  async hero() {
    await page.goto("about:blank");
    await start("hero");
    await page.goto(SITE, { waitUntil: "domcontentloaded" });
    await sleep(5500); // the ruler animates on load
    await stop();
  },
  async exhibit() {
    // Narration says 14 days / 94%: stay on the 14-day state (the default) and point at it.
    await home();
    await page.evaluate(async (y) => window.scrollTo(0, y), await topOf("#measured", 40));
    await start("exhibit");
    await sleep(600);
    await scrollTo(await topOf("#exhibit-label", 150), 1600);
    await sleep(1500);
    await ring(page.locator('button[data-days="14"]'));
    await sleep(1200);
    await ring(page.locator("#pct"));
    await sleep(3000);
    await stop();
  },
  async record() {
    await home();
    await page.evaluate(async (y) => window.scrollTo(0, y), (await topOf("#record")) - 300);
    await start("record");
    await sleep(400);
    await scrollTo(await topOf("#record", -40), 1500);
    await sleep(5000);
    await stop();
  },
  async mechanism() {
    await home();
    await page.evaluate(async (y) => window.scrollTo(0, y), (await topOf("#mechanism")) - 300);
    await start("mechanism");
    await sleep(400);
    await scrollTo(await topOf("#flow", 260), 1500);
    await sleep(6000);
    await scrollTo(await topOf("#flow", 60), 1500);
    await sleep(5000);
    await stop();
  },
  async sepolia() {
    // One long clip through all 11 steps; compose.js cuts it into scenes 6, 7 and 8 at the marks.
    await home();
    await page.evaluate(async (y) => window.scrollTo(0, y), (await topOf("#sepolia")) - 300);
    const marks = [];
    await start("sepolia");
    const mark = (label) => marks.push({ label, t: Date.now() / 1000 });
    await sleep(400);
    await scrollTo(await topOf("#ledger", 150), 1600);
    await sleep(2200);
    for (const step of [2, 3, 4]) { await next(); await sleep(2600); }
    mark("act1-end");
    for (const step of [5, 6]) { await next(); await sleep(2600); }
    mark("act2-start");
    for (const step of [7, 8, 9, 10, 11]) { await next(); await sleep(2800); }
    current.marks = marks;
    await stop();
  },
  async checked() {
    await home();
    await page.evaluate(async (y) => window.scrollTo(0, y), (await topOf("#checked")) - 300);
    await start("checked");
    await sleep(400);
    await scrollTo(await topOf("#checked", -40), 1500);
    await sleep(5500);
    await scrollTo((await topOf("#checked", -40)) + 420, 1500);
    await sleep(4000);
    await stop();
  },
  async limits() {
    await home();
    await page.evaluate(async (y) => window.scrollTo(0, y), (await topOf("#limits")) - 300);
    await start("limits");
    await sleep(400);
    await scrollTo(await topOf("#limits", -40), 1500);
    await sleep(5000);
    await stop();
  },
  async etherscan() {
    await page.goto(AMS_TX, { waitUntil: "domcontentloaded" });
    await sleep(4000);
    await start("etherscan");
    await sleep(3500);
    await scrollTo(380, 1600);
    await sleep(3500);
    await stop();
  },
};

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });
  const ctx = await browser.newContext({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.25, colorScheme: "light" });
  page = await ctx.newPage();
  page.setDefaultTimeout(60_000);
  cdp = await ctx.newCDPSession(page);
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    try { await cdp.send("Page.screencastFrameAck", { sessionId }); } catch {}
    if (!current) return;
    const file = String(current.frames.length).padStart(5, "0") + ".jpg";
    fs.writeFileSync(path.join(current.dir, file), Buffer.from(data, "base64"));
    current.frames.push({ file, t: metadata.timestamp });
  });
  const want = process.argv.slice(2);
  for (const [name, fn] of Object.entries(clips)) if (!want.length || want.includes(name)) await fn();
  await browser.close();
})();
