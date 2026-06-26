# feedback-log — FunCode → Product Brain

Append new items to the **top**. Schema and rules in [`README.md`](./README.md). Product Brain agents respond in [`pb-reports.md`](./pb-reports.md).

---

## FB-007 — A `pb refile` helper for moving an entry between collections
- **Date:** 2026-06-26
- **Type:** idea
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Re-filing TEN-6/7/8 (tensions) into QUE-1/2/3 (questions) took a manual 3-step dance: capture new entry, archive the old one, then `pb relate` the two — done six times by hand.
- **Detail:** Add `pb refile <ID> -c <collection>` that atomically (a) creates the target entry carrying over description/context/links, (b) archives the source, and (c) links them with a typed `supersedes`/`related_to` relation — one traceable step instead of three error-prone ones.
- **PB response:** —

## FB-006 — Surface the domain-proposal backlog + confidence-gated auto-accept
- **Date:** 2026-06-26
- **Type:** wish
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** `pb proposals` shows only 3 (consent/relation) proposals, while `pb authority-domains review` shows ~67 pending capture-time domain tags — two separate queues, easy to confuse, and the big one silently grows. (Extends FB-003.)
- **Detail:** (1) `pb proposals` should surface or cross-reference the `authority-domains` backlog count so agents don't think "3" is the whole story. (2) `pb session close` should print a pending-proposal summary line. (3) Confidence-gated auto-accept: auto-accept domain tags ≥0.9, queue 0.6–0.9 for review.
- **PB response:** —

## FB-005 — `pb search` should exclude archived entries by default
- **Date:** 2026-06-26
- **Type:** bug
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** After archiving TEN-6/7/8, `pb search "community-led product-led"` still returns them right next to the live QUE-1/2/3. Since handshake/orient lean on search, a future agent can re-read stale, archived framings and act on the wrong one.
- **Detail:** `pb search` (and the search feeding handshake/orient) should exclude `status: archived` by default, with an opt-in `--include-archived`. At minimum, down-rank and clearly flag archived hits. Highest-leverage retrieval-hygiene fix.
- **PB response:** —

## FB-004 — `pb collections list` + `pb fields <slug>` are excellent for discovery
- **Date:** 2026-06-26
- **Type:** like
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Needed to confirm whether a `questions` collection existed and what fields it accepted before re-filing entries.
- **Detail:** `pb collections list` (slug + description per collection) and `pb fields <slug>` (full schema incl. option enums, colorMaps, help text) made the right collection and field choices obvious in two commands. This is the discovery path that would have prevented FB-002 if agents reached for it first. Keep it; consider surfacing it in capture errors.
- **PB response:** —

## FB-003 — Every capture spawns a `domainProposalPending` with no triage nudge
- **Date:** 2026-06-26
- **Type:** wish
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** After a session of captures, `pb proposals` had a large backlog of pending domain-tag proposals.
- **Detail:** Each `pb capture` auto-proposes a domain tag (`domainProposalPending: true`) that needs human/agent review, but nothing nudges anyone to triage them, so they silently accumulate. Wish: a session-close summary line ("N domain proposals pending — `pb accept --auto` or review") or an option to auto-accept high-confidence domain tags.
- **PB response:** —

## FB-002 — Nothing stops an open question being mis-filed as a tension
- **Date:** 2026-06-26
- **Type:** idea
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Three open strategic forks were captured as `tensions` (TEN-6/7/8) when they were open questions belonging in `questions` (QUE). Had to archive and re-file as QUE-1/2/3.
- **Detail:** `tensions` = friction/pain/bugs; `questions` = open forks/unknowns — but capture offers no hint when question-shaped text ("should we…?", "is X or Y?", "open question") lands in the wrong collection. Idea: a capture-time heuristic that detects question phrasing and suggests `-c questions`, or a confirm prompt when text looks like a question but `-c tensions` was chosen.
- **PB response:** —

## FB-001 — Piping `pb` into `head`/`tail` reports a false failure (SIGPIPE)
- **Date:** 2026-06-26
- **Type:** bug
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** Ran `pb session close --force 2>&1 | head -20` to keep output short; the command returned a non-zero exit code.
- **Detail:** `head` closes the pipe after N lines, `pb` keeps writing, receives SIGPIPE, and exits non-zero. The captures had **succeeded**, but the non-zero exit looked like a failed capture and caused real alarm ("chain capture gone wrong"). Wish: `pb` should treat downstream pipe-close as a clean exit (handle EPIPE → exit 0), or docs should warn against piping `pb` into `head`/`tail`/`sed`. Worked around by not piping and reading the terminal output directly.
- **PB response:** —
