// Scene 5: replays the real CRE CLI output of 22 Oct 2026 (demo/cre-simulate-live-2026-10-22.log) as a terminal,
// line by line at the pace of its own timestamps, and writes clips/terminal/ (PNG frames + frames.json) for compose.js.
// The output text is not edited; only highlights are added. Usage: node make-terminal.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const LOG = path.join(ROOT, "..", "cre-simulate-live-2026-10-22.log");
const OUT = path.join(ROOT, "clips", "terminal");
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const raw = fs.readFileSync(LOG, "utf8").split(/\r?\n/);
const command = raw[0].replace(/^#\s*/, "");
const lines = raw.filter((l) => !l.startsWith("#"));
while (lines.length && lines[0] === "") lines.shift();
// Seconds since the first timestamped line; lines without a timestamp take the previous one.
let last = null, t0 = null;
const timed = lines.map((l) => {
  const m = l.match(/^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)Z/);
  if (m) { last = Date.parse(m[1] + "Z") / 1000; if (t0 === null) t0 = last; }
  return { text: l, t: last === null ? 0 : last - t0 };
});

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const mark = (s) =>
  esc(s)
    .replace(/(eventBits=0b1000)/, '<b class="hit">$1</b>')
    .replace(/(eventBits=0b0)\b/, '<b class="ok">$1</b>')
    .replace(/(&quot;status&quot;:&quot;active&quot;|"status":"active")/, '<b class="warn">$1</b>')
    .replace(/(2450:5219886|2452:5229442)/g, '<b class="hit">$1</b>')
    .replace(/(✓ Workflow Simulation Result:)/, '<b class="ok big">$1</b>')
    .replace(/(attestation written, tx 0x[0-9a-f]+)/, '<b class="ok">$1</b>')
    .replace(/^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ)/, '<span class="ts">$1</span>');

const page = (k) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;width:1920px;height:1080px;background:#f2ede2;font-family:"IBM Plex Mono",Consolas,monospace}
  .win{position:absolute;left:80px;right:80px;top:84px;bottom:150px;background:#15130f;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden}
  .bar{height:52px;background:#2a261f;display:flex;align-items:center;padding:0 22px;gap:12px;color:#bdb4a3;font-size:20px}
  .bar i{width:15px;height:15px;border-radius:50%;background:#5a5347;display:inline-block}
  .bar span{margin-left:16px}
  .body{padding:22px 30px;color:#ece5d5;font-size:19.5px;line-height:1.42;white-space:pre-wrap;word-break:break-all;display:flex;flex-direction:column;justify-content:flex-end;height:calc(100% - 52px - 44px);box-sizing:border-box}
  .p{color:#e6a39b}.ts{color:#857c6d}.hit{color:#ff8a7a;font-weight:500}.ok{color:#9fd39a;font-weight:500}.warn{color:#f0c36a;font-weight:500}.big{font-size:22px}
  .label{position:absolute;left:80px;right:80px;top:30px;font-size:21px;color:#48433b;letter-spacing:.05em;display:flex;justify-content:space-between}
  .label b{color:#a3271d;font-weight:500}
</style></head><body><div class="win"><div class="bar"><i></i><i></i><i></i><span>status-monitor · CRE CLI 1.38.0</span></div>
<div class="body"><div><span class="p">$ </span>${esc(command)}\n${timed.slice(0, k).map((l) => mark(l.text)).join("\n")}</div></div></div>
<div class="label"><span><b>Recorded 22 Oct 2026</b> · live sources: The Gazette, Companies House, GLEIF · output as printed from “Simulator Initialized”</span><span>demo/cre-simulate-live-2026-10-22.log</span></div></body></html>`;

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const frames = [];
  const shot = async (k, t) => {
    await p.setContent(page(k));
    const file = String(frames.length).padStart(5, "0") + ".png";
    await p.screenshot({ path: path.join(OUT, file) });
    frames.push({ file, t });
  };
  await shot(0, 0);
  // Lines appear at their own timestamps (+1 s after the command); blank lines ride with the next line.
  for (let k = 1; k <= timed.length; k++) {
    if (timed[k - 1].text === "" && k < timed.length) continue;
    await shot(k, 1 + timed[k - 1].t);
  }
  frames.push({ ...frames.at(-1), t: frames.at(-1).t + 2 });
  fs.writeFileSync(path.join(OUT, "frames.json"), JSON.stringify({ name: "terminal", frames }, null, 1));
  console.log(`terminal: ${frames.length} frames over ${frames.at(-1).t.toFixed(1)} s`);
  await browser.close();
})();
