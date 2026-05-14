# Branch consolidation → `launchday` — design

**Status:** approved, ready for execution
**Date:** 2026-05-14
**Why:** Work is scattered across 10 outstanding feature branches as launch approaches.
Goal: one branch, `launchday`, where everything important comes together — without
losing any wanted change.

## Goals

1. Single integration branch `launchday` containing all outstanding work.
2. No wanted change lost — every source branch left untouched as backup.
3. Each branch's contribution isolated as its own merge commit (full audit trail).
4. Every merge verified before the next is applied.

## Non-goals

- Deleting old branches (kept as backup until `launchday` is confirmed good).
- Squashing / rewriting history of source branches.
- Resolving the tangled topology "correctly" by archaeology — we integrate and verify.

## Approach

`launchday` is branched from `origin/main` (already the most-consolidated point —
has image pipeline, analytics, and consent code). The 10 outstanding branches are
merged in one at a time, foundational/small first, biggest last. Source branches
are read-only throughout, so nothing can be lost; `launchday` is disposable and
rebuildable if integration goes sideways.

## Merge order

| # | Branch | ~commits | Rationale |
|---|--------|----------|-----------|
| 1 | `fix/ci-test-excludes` | 4 | Repairs main's broken test suite — makes later test gates meaningful |
| 2 | `feat/phase-0-docs` | 19 | Docs + CI config (`.npmrc`, lockfile) — low conflict risk |
| 3 | `feat/phase-1-plan` | 44 | Sentry + GA4 + Clarity + Firestore rules — analytics foundation |
| 4 | `feat/image-pipeline-d4` | 33 | Image pipeline d2–d5 (d2 superseded, contained here) |
| 5 | `feat/cwv-seo-wip` | 7 | Today's autoplay + card fixes — builds on image pipeline |
| 6 | `feat/consent-banner-pr` | 1 | After analytics lands, so consent has something to gate |
| 7 | `feat/spec-15-admin-seo` | 5 | SEO group |
| 8 | `feat/spec-17-audit-scripts` | 6 | SEO group |
| 9 | `feat/spec-18-server-meta` | 5 | SEO group |
| 10 | `feat/plan-c-r22-r44-upgrade` | 104 | Biggest — last, when everything else is settled |

`feat/image-pipeline-d2` is excluded — `git merge-base` confirms it is fully
contained in `feat/image-pipeline-d4`.

## Verification gate (after every merge)

- `npx vite build` must succeed — **hard gate**.
- `npm test` runs; pre-existing flaky failures noted but not blockers.
- If the build breaks or an obvious regression appears: **stop and report**, do not
  stack the next merge on top.

## Conflict policy

- Resolve by understanding both sides — never blind-pick.
- Expected hot spots: analytics files (`analytics.js` / `ga.js` / `main.jsx` —
  touched by phase-1, consent, spec-17) and `Image.jsx` (d4 + today's work).
- Genuinely ambiguous conflicts (intended version unclear): **pause and ask**.

## Pre-flight

Push local `feat/cwv-seo-wip` to origin first — it carries today's fixes in commit
`bbfff40` not yet on the remote.

## End state

- `launchday` = `origin/main` + 10 discrete merge commits, pushed to origin.
- Old branches untouched (backup) — cleanup deferred until `launchday` verified in a
  real preview.
- All work going forward happens on `launchday`.
