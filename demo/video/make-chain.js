// Scene 5, second half: the attestations read back from the StatusRegistry on Sepolia (clips/readback.json from
// readback.ts), shown as a card that fills in step by step. Writes clips/chain/ (PNG frames + frames.json).
// Usage: bun readback.ts && node make-chain.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "clips", "chain");
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "clips", "readback.json"), "utf8"));
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const BITS = ["Companies House status adverse", "Companies House insolvency history", "Gazette: petition pending", "Gazette: insolvency proceeding (winding-up order)", "Gazette: petition dismissed", "GLEIF: LEI lapsed", "sources disagree"];
const bits = (v) => (v === 0 ? "nothing found in any source" : BITS.filter((_, i) => v & (1 << i)).join(" · "));
const date = (s) => new Date(s * 1000).toISOString().slice(0, 10);
const short = (h) => `${h.slice(0, 10)}…${h.slice(-4)}`;
const NAMES = { "11877818": "AMS FACILITIES (SW) LTD", "00445790": "TESCO PLC (control)" };

const row = (r) => `<div class="row">
  <div class="co"><b>${NAMES[r.company]}</b><span>company ${r.company} · attestation #${r.id}</span></div>
  <div class="kv"><span>eventBits</span><b class="${r.eventBits ? "hit" : "ok"}">0b${r.eventBits.toString(2)}</b><em>${bits(r.eventBits)}</em></div>
  ${r.petitionPresentedAt ? `<div class="kv"><span>petition presented</span><b>${date(r.petitionPresentedAt)}</b><em>advertised ${date(r.petitionPublishedAt)}</em></div>` : ""}
  <div class="kv"><span>evidenceHash</span><b>${short(r.evidenceHash)}</b><em>same hash as the CLI output</em></div>
  <div class="kv"><span>transaction</span><b>${short(r.tx)}</b><em>block ${r.block.toLocaleString("en")} · ${r.status}</em></div>
</div>`;

const page = (k) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&display=swap">
<style>
  html,body{margin:0;width:1920px;height:1080px;background:#f2ede2;color:#1a1814;font-family:Newsreader,Georgia,serif}
  .wrap{position:absolute;left:200px;right:200px;top:110px}
  .k{font-family:"IBM Plex Mono",monospace;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:#a3271d}
  h1{font-weight:400;font-size:64px;margin:18px 0 10px}
  .call{font-family:"IBM Plex Mono",monospace;font-size:25px;color:#48433b;padding:18px 0 26px;border-bottom:2px solid #1a1814}
  .row{padding:26px 0;border-bottom:1px solid #ddd4c1;}
  .co b{font-size:40px;font-weight:500}.co span{font-family:"IBM Plex Mono",monospace;font-size:21px;color:#827a6c;margin-left:24px}
  .kv{display:grid;grid-template-columns:300px 330px 1fr;align-items:baseline;margin-top:12px;font-size:28px}
  .kv span{font-family:"IBM Plex Mono",monospace;font-size:21px;color:#827a6c;letter-spacing:.06em}
  .kv b{font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:25px}.kv em{color:#48433b}
  .hit{color:#a3271d}.ok{color:#2f6b2b}
</style></head><body><div class="wrap">
<p class="k">Read back from Ethereum Sepolia · ${date(data.readAt)}</p>
<h1>What the registry now says</h1>
<p class="call">StatusRegistry ${data.registry.slice(0, 10)}…${data.registry.slice(-4)} · getLatest(entityIdFor(company))</p>
${data.rows.slice(0, k).map(row).join("")}
</div></body></html>`;

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const frames = [];
  for (const [k, t] of [[0, 0], [1, 1.2], [2, 4.2]]) {
    await p.setContent(page(k), { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const file = String(frames.length).padStart(5, "0") + ".png";
    await p.screenshot({ path: path.join(OUT, file) });
    frames.push({ file, t });
  }
  frames.push({ ...frames.at(-1), t: 7.5 });
  fs.writeFileSync(path.join(OUT, "frames.json"), JSON.stringify({ name: "chain", frames }, null, 1));
  console.log(`chain: ${frames.length} frames`);
  await browser.close();
})();
