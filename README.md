# ⚾ World Series Watch '26

A plain-English tracker of who's headed to baseball's World Series — built so anyone can
follow along, no baseball knowledge required.

- **The road to the World Series** — a projected, seeded bracket from today's standings:
  twelve playoff teams, three knockout rounds per league, converging on the title.
- **Who's in right now** — each league's six playoff teams (division leaders + wild cards)
  and the teams still chasing, each with plain-English playoff odds.
- **Make your call** — pick each league's champion and the World Series winner; picks save
  locally and share by link so a group can compare.
- **The standings, made simple** — every division as a clean win-percentage bar.
- **How it works** — a six-step explainer plus tap-to-define glossary on every baseball term.

## Develop

```sh
npm install
npm run dev          # local dev server
npm run fetch-data   # refresh public/data/*.json from ESPN
npm run build        # type-check + production build
```

## Data

`scripts/fetch-data.mjs` pulls ESPN's MLB standings (by league → division) and today's
scoreboard — no API key — and writes `public/data/standings.json` (records, playoff odds,
seeds, magic numbers, run differential) plus a computed playoff picture, and `games.json`.
A nightly GitHub Actions cron refreshes it and redeploys automatically — no manual routine
needed for the data. Unlike the World Cup site, there's no media to curate, so the script
does it all. An optional Claude editorial routine (a plain-English "state of the race"
digest + feed sanity check + playoff-phase watch) lives in [NIGHTLY_ROUTINE.md](NIGHTLY_ROUTINE.md).

Unofficial, non-commercial fan project. Not affiliated with MLB or any team.
