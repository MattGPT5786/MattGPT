// MattGPT fantasy bake: render the Dinkers matchup + standings snapshot into
// index.html between the FF markers. Data comes from a Yahoo read (browser)
// saved as private/fantasy.json by whoever runs the bake — this script never
// touches Yahoo itself. Raw export lives only in private/ and is never pushed.
//
// private/fantasy.json shape:
// { "week": 9, "asOf": "Sun, Nov 8 · 12:52 PM ET",
//   "matchup": { "me":  {"name":"ScherThing","score":"28.20","proj":"143.07","yet":9},
//                "opp": {"name":"NACL","score":"19.40","proj":"130.54","yet":7},
//                "winPct": 60 },
//   "standings": [ {"place":1,"team":"Cakefarts.com","record":"6-2","pf":"984.10"}, ... ] }
import { readFileSync, writeFileSync } from "node:fs";

const DIR = new URL(".", import.meta.url).pathname;
const d = JSON.parse(readFileSync(DIR + "private/fantasy.json", "utf8"));

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const m = d.matchup;
const meta = [
  (m.me.proj && m.opp.proj) ? `Proj ${esc(m.me.proj)} – ${esc(m.opp.proj)}` : "",
  (m.winPct != null) ? `Win ${esc(m.winPct)}%` : "",
  (m.me.yet != null && m.opp.yet != null) ? `Yet to play ${esc(m.me.yet)} – ${esc(m.opp.yet)}` : "",
].filter(Boolean).join(" · ");

// Standings as a bell curve by record (Matt, Nov 13 2026): teams are placed on a
// Gaussian curve at their win total, stacked when records tie, with each team's
// total points-for (PF) printed on top of its marker.
const games = (() => { const p = String(d.standings[0].record).split("-"); return (+p[0]) + (+p[1]); })();
const byWins = new Map();
for (const t of d.standings) {
  const w = +String(t.record).split("-")[0];
  if (!byWins.has(w)) byWins.set(w, []);
  byWins.get(w).push(t);
}
for (const arr of byWins.values()) arr.sort((a, b) => parseFloat(b.pf) - parseFloat(a.pf));
const winVals = d.standings.map((t) => +String(t.record).split("-")[0]);
const mean = winVals.reduce((a, b) => a + b, 0) / winVals.length;
const sd = Math.max(0.9, Math.sqrt(winVals.reduce((a, b) => a + (b - mean) ** 2, 0) / winVals.length));
const minW = Math.min(...winVals), maxW = Math.max(...winVals);

const W = 920, H = 318, BASE = 288, PADX = 70;
const X = (w) => PADX + (w - minW) * ((W - 2 * PADX) / Math.max(1, maxW - minW));
const gauss = (x) => Math.exp(-((x - mean) ** 2) / (2 * sd * sd));
const curveY = (w) => BASE - gauss(w) * 62;

let path = "";
for (let i = 0; i <= 72; i++) {
  const w = minW - 0.55 + (i / 72) * (maxW - minW + 1.1);
  path += `${i === 0 ? "M" : "L"}${X(w).toFixed(1)},${curveY(w).toFixed(1)} `;
}
const area = `${path}L${X(maxW + 0.55).toFixed(1)},${BASE} L${X(minW - 0.55).toFixed(1)},${BASE} Z`;

const short = (s) => (s.length > 16 ? s.slice(0, 16).trimEnd() + "…" : s);
const SLOT = 40;
let cols = "";
for (let w = minW; w <= maxW; w++) {
  const x = X(w), teams = byWins.get(w) || [];
  cols += `<line x1="${x}" y1="${BASE - 4}" x2="${x}" y2="${BASE + 4}" stroke="#a7adb5" stroke-width="1"/>`;
  cols += `<text x="${x}" y="${BASE + 18}" text-anchor="middle" font-size="10.5" font-weight="${teams.length ? 700 : 400}" fill="${teams.length ? "#4c566c" : "#9aa4ae"}">${w}-${games - w}</text>`;
  teams.forEach((t, i) => {
    const top = curveY(w) - (teams.length - i) * SLOT;
    const me = t.team === m.me.name;
    cols += `<g><title>${esc(t.team)} · ${esc(t.record)} · PF ${esc(t.pf)}</title>` +
      `<text x="${x}" y="${(top + 12).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="800" fill="${me ? "#123c6e" : "#2a2e35"}">${esc(t.pf)}</text>` +
      `<circle cx="${x}" cy="${(top + 23).toFixed(1)}" r="4.6" fill="${me ? "#1f66c1" : "#6d84a2"}"/>` +
      `<text x="${x}" y="${(top + 37).toFixed(1)}" text-anchor="middle" font-size="8.6" fill="${me ? "#123c6e" : "#5a6672"}">${esc(short(t.team))}</text></g>`;
  });
}
const chart = `<div class="ff-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Standings bell curve by record, points-for on top of each team">` +
  `<path d="${area}" fill="rgba(31,102,193,.10)"/>` +
  `<path d="${path}" fill="none" stroke="#1f66c1" stroke-width="2.4"/>` +
  `<line x1="${PADX - 26}" y1="${BASE}" x2="${W - PADX + 26}" y2="${BASE}" stroke="#c3cad2" stroke-width="1"/>` +
  cols + `</svg></div>`;

const html = `<div class="ff-vs">Week ${esc(d.week)} matchup</div>
        <div class="ff-match">
          <div class="ff-team me"><span class="nm">${esc(m.me.name)}</span><span class="sc">${esc(m.me.score)}</span></div>
          <div class="ff-team"><span class="nm">${esc(m.opp.name)}</span><span class="sc">${esc(m.opp.score)}</span></div>
          ${meta ? `<div class="ff-meta">${meta}</div>` : ""}
        </div>
        ${chart}
        <div class="ff-asof">Snapshot ${esc(d.asOf)}</div>`;

const file = DIR + "index.html";
const page = readFileSync(file, "utf8");
if (!page.includes("<!--FF_START-->") || !page.includes("<!--FF_END-->"))
  throw new Error("FF markers not found in index.html");
writeFileSync(file, page.replace(/<!--FF_START-->[\s\S]*?<!--FF_END-->/,
  "<!--FF_START-->\n        " + html + "\n        <!--FF_END-->"));
console.log(`fantasy bake done: week ${d.week}, ${d.standings.length} teams, as of ${d.asOf}`);
