# MattGPT — Personal Dashboard

A single-file HTML dashboard (originally "Scher Scores"). Sports scores from ESPN's public API, weather from Open-Meteo, market indexes from CNBC's CORS-open quote/chart feeds, drawn as custom in-page line charts — no API keys, no backend, no build step. Just open `index.html` or host it on GitHub Pages.

## What it shows
- **Weather:** current conditions, today's high, sunrise/sunset, and a 5-day forecast for Cherry Hill, NJ 08003 (Open-Meteo, keyless + CORS-open, coordinates 39.9351, -75.0307).
- **Layout:** on wide, tall-enough screens (≥1180×720) the page switches to a one-screen dashboard grid — weather left, My Teams center, markets right, score ticker along the bottom — with no scrolling. Smaller windows fall back to a stacked layout.
- **Markets:** 1-month charts for three indexes — S&P 500 (.SPX), Dow Jones (.DJI), and Nasdaq Composite (.IXIC) — built in-page from CNBC's CORS-open feeds (restQuote for price/change, ts-api harmony bars for daily closes; verified live Nov 8, 2026). Earlier the panel used TradingView mini embeds, which couldn't be themed (iframe) and blocked the Nasdaq Composite; Stooq is behind a JavaScript bot wall and Yahoo/Nasdaq APIs send no CORS headers, so CNBC is the working source.
- **My Teams first:** New York Giants (NFL), Penn State Nittany Lions (NCAA football, Big Ten), New York Knicks (NBA), Washington Capitals (NHL), New York Yankees (MLB), Saint Joseph's Hawks (NCAA basketball, Atlantic 10). If a team has no game today, its next scheduled game is shown instead — with both teams' logos.
- **Score ticker:** every other game from the NFL, College Football (Big Ten + Top 25), NBA, NHL, MLB, and College Hoops (Atlantic 10 + Top 25) boards scrolls in an ESPN-style marquee under the favorites. Hover pauses it.
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
