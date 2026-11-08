# MattGPT — Personal Dashboard

A single-file HTML dashboard (originally "Scher Scores"). Sports scores from ESPN's public API, weather from Open-Meteo, market indexes via TradingView widgets — no API keys, no backend, no build step. Just open `index.html` or host it on GitHub Pages.

## What it shows
- **Weather:** current conditions and a 5-day forecast for Cherry Hill, NJ 08003 (Open-Meteo, keyless + CORS-open, coordinates 39.9351, -75.0307).
- **Markets:** S&P 500, Dow Jones, Nasdaq 100, and Russell 2000 quote cards via TradingView's embed widget (free quote JSON APIs — Stooq/CNBC/Yahoo — were bot-walled or rate-limited when checked Nov 8, 2026, so the standard embed is used instead).
- **My Teams first:** New York Giants (NFL), New York Knicks (NBA), Washington Capitals (NHL), New York Yankees (MLB), Saint Joseph's Hawks (NCAA, Atlantic 10). If a team has no game today, its next scheduled game is shown instead.
- **Score ticker:** every other game from the NFL, NBA, NHL, MLB, and College Hoops (Atlantic 10 + Top 25) boards scrolls in an ESPN-style marquee under the favorites. Hover pauses it.
- Live games get a pulsing LIVE indicator with clock/period; final games dim the loser.
- Auto-refreshes every 60 seconds.

## Note on the Hershey Bears
Hershey Bears (AHL) are **not** in ESPN's API — the AHL scoreboard endpoint returns 400/404 (verified Nov 8, 2026). A placeholder card was removed from the favorites row on Nov 8, 2026 at the owner's request.

## Data source
`https://site.api.espn.com/apis/site/v2/sports/.../scoreboard` — unofficial public endpoints, CORS-open (`Access-Control-Allow-Origin: *`), which is what makes a static GitHub Pages site possible.

## Run it on GitHub Pages
1. Push this folder to a GitHub repo (e.g. `sports-scores`).
2. Repo **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. Your site goes live at `https://<username>.github.io/sports-scores/`.
