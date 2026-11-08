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

const rows = d.standings.map((t) => {
  const me = t.team === m.me.name ? ' class="me"' : "";
  return `<tr${me}><td>${esc(t.place)}</td><td class="nm" title="${esc(t.team)}">${esc(t.team)}</td><td>${esc(t.record)}</td><td class="r">${esc(t.pf)}</td></tr>`;
}).join("\n          ");

const html = `<div class="ff-vs">Week ${esc(d.week)} matchup</div>
        <div class="ff-match">
          <div class="ff-team me"><span class="nm">${esc(m.me.name)}</span><span class="sc">${esc(m.me.score)}</span></div>
          <div class="ff-team"><span class="nm">${esc(m.opp.name)}</span><span class="sc">${esc(m.opp.score)}</span></div>
          ${meta ? `<div class="ff-meta">${meta}</div>` : ""}
        </div>
        <table class="ff-std">
          <tr><th>#</th><th>Team</th><th>W-L</th><th class="r">PF</th></tr>
          ${rows}
        </table>
        <div class="ff-asof">Snapshot ${esc(d.asOf)}</div>`;

const file = DIR + "index.html";
const page = readFileSync(file, "utf8");
if (!page.includes("<!--FF_START-->") || !page.includes("<!--FF_END-->"))
  throw new Error("FF markers not found in index.html");
writeFileSync(file, page.replace(/<!--FF_START-->[\s\S]*?<!--FF_END-->/,
  "<!--FF_START-->\n        " + html + "\n        <!--FF_END-->"));
console.log(`fantasy bake done: week ${d.week}, ${d.standings.length} teams, as of ${d.asOf}`);
