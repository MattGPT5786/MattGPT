# Scher Scores

A single-file HTML scoreboard powered by ESPN's public scoreboard API — no API key, no backend, no build step. Just open `index.html` or host it on GitHub Pages.

## What it shows
- **My Teams first:** New York Giants (NFL), New York Knicks (NBA), Washington Capitals (NHL), New York Yankees (MLB), Saint Joseph's Hawks (NCAA, Atlantic 10). If a team has no game today, its next scheduled game is shown instead.
- **Full boards:** NFL, NBA, NHL, MLB, and College Hoops (Atlantic 10 + Top 25), filterable by the tabs at the top.
- Live games get a pulsing LIVE indicator with clock/period; final games dim the loser.
- Auto-refreshes every 60 seconds.

## Known gap
Hershey Bears (AHL) are **not** in ESPN's API — the AHL scoreboard endpoint returns 400/404 (verified Nov 8, 2026). Their card links out to theahl.com rather than showing invented data.

## Data source
`https://site.api.espn.com/apis/site/v2/sports/.../scoreboard` — unofficial public endpoints, CORS-open (`Access-Control-Allow-Origin: *`), which is what makes a static GitHub Pages site possible.

## Run it on GitHub Pages
1. Push this folder to a GitHub repo (e.g. `sports-scores`).
2. Repo **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. Your site goes live at `https://<username>.github.io/sports-scores/`.
