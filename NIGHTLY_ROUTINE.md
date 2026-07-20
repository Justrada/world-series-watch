# Nightly Claude routine (optional)

**You may not need this.** A GitHub Actions cron already refreshes the standings and
redeploys every night (see `.github/workflows/deploy.yml`) — the mechanical part is
automated, because unlike the World Cup site there's no media to curate. This routine is
the *editorial + safety* layer a script can't do: a plain-English daily digest, a sanity
check on ESPN's feed, and catching the regular-season → playoffs transition in October.

Schedule it a bit **after** the data cron (which runs 10:30 UTC) so it picks up that
commit — e.g. 11:30 UTC / ~4:30am ET. In Claude Code: `/schedule`, paste the prompt.

## Permissions (so it never stalls overnight)

This repo commits `.claude/settings.json` with `"permissions": { "defaultMode":
"bypassPermissions" }`, so a session started inside `~/WORLDSERIES2026` skips prompts.
For a cron/headless run, also launch with the flag:
`claude --dangerously-skip-permissions -p "<the prompt>"`. Fine here — the routine only
touches this repo and public sports data.

---

## The prompt

```
You are the nightly editor for World Series Watch '26, a plain-English MLB playoff
tracker in ~/WORLDSERIES2026 (GitHub: world-series-watch, deploys to GitHub Pages on
push). Work autonomously; do not ask questions. Read CLAUDE.md first.

A GitHub Actions cron already refreshes the standings and redeploys nightly, so your job
is the layer a script can't do — verification, a plain-English digest, and catching
season-phase changes. Coordinate, don't collide: always `git pull --rebase` first, and
only commit when there's an actual change.

1. `git pull --rebase`, then run `node scripts/fetch-data.mjs` so the standings and
   today's games are current. If `git diff public/data` is empty, the cron already did
   it — that's fine, carry on.

2. Sanity-check before trusting anything: standings.json has all 30 teams, every league
   has exactly 3 division leaders, every JSON file parses, and `npm run build` passes.
   If ESPN's feed drifted (missing fields, a division with no leader, zero games), do
   NOT commit — stop and report exactly what looks wrong.

3. Watch the season phase. It's the regular-season standings race until early October;
   then the real playoffs begin (Wild Card -> Division Series -> League Championship ->
   World Series). The site currently shows a *projected* bracket seeded from the
   standings. The day real postseason games start, that projection needs to become the
   live bracket (actual series and scores) — if you detect the postseason has begun,
   flag it clearly in your output and note that fetch-data.mjs needs the playoff-series
   feed added; do not silently leave a stale projection up.

4. Write a short, beginner-friendly "State of the Race" digest (3-5 sentences), biggest
   moves first: any team that moved into or out of a playoff spot, notable win/lose
   streaks, magic-number milestones ("the Dodgers are 6 wins from clinching"), and
   standout results from games.json. Assume the reader doesn't follow baseball — no
   jargon without a plain-English gloss. This is the shareable daily blurb.

5. If anything actually changed, commit ("nightly: standings + race notes for <date>")
   and `git push` (this deploys). End with the digest as your final output.
```

---

Notes:
- If ESPN's MLB endpoints ever break, `fetch-data.mjs` throws loudly; the standings
  source is `site.api.espn.com/apis/v2/sports/baseball/mlb/standings`.
- After the World Series ends (~early November), retire the routine; the site stays up
  as a record of the season.
