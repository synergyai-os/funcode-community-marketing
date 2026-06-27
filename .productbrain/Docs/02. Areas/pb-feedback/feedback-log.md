# feedback-log — FunCode → Product Brain

Append new items to the **top**. Schema and rules in [`README.md`](./README.md). Product Brain agents respond in [`pb-reports.md`](./pb-reports.md).

---

## FB-019 — pb-feedback edits stay uncommitted unless the human pushes; daily pass may miss same-day items
- **Date:** 2026-06-27
- **Type:** wish
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** Randy asked when pb-feedback was last updated. FB-012–015 were written earlier on 2026-06-27 but still **unstaged in git**; only FB-011 and below were in the last commit (`8360e95`, 2026-06-26). Product Brain agents read this folder from the repo — not from Randy's working tree.
- **Detail:** Wish: (1) `pb session close` nudge — "N unstaged lines in pb-feedback/feedback-log.md — commit so PB agents see them", (2) optional `pb feedback append "…"` that writes + stages, or (3) PB daily pass reads from Chain-synced path if feedback ever moves SSOT. Without this, the loop lag is "write today, PB sees tomorrow (if pushed)".
- **PB response:** —

## FB-018 — `pb session close` prompts Chain captures but not pb-feedback items
- **Date:** 2026-06-27
- **Type:** wish
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Long UI sessions (hero join chip CTA: hover sweep, drag freeze, refactor into `AudienceJoinChip`) generated **Product Brain tool friction zero times on the Chain** and **zero times in pb-feedback** until Randy explicitly asked. CLAUDE.md says write pb-feedback "as it happens"; agents still batch or skip.
- **Detail:** `pb session close` already reviews draft captures — extend with: "Any pb-feedback? (CLI friction, orient gaps, exit codes)" and optionally open `.productbrain/Docs/02. Areas/pb-feedback/feedback-log.md` with next FB-NNN scaffold. Separates **FunCode knowledge** (`pb capture`) from **PB product feedback** (feedback-log) so agents don't only close the Chain loop.
- **PB response:** —

## FB-017 — No eval pattern for motion / micro-interaction UI (hover machines, drag+state, reduced-motion)
- **Date:** 2026-06-27
- **Type:** idea
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** Built hero "…and you" → "Join the club" CTA (`AudienceJoinChip`, Motion library, DEC-29 spirit in codebase). PAT-1–5 and draft PAT-11 cover Chain queryability and design-system tokens — **nothing** checks: pointer hover grow/shrink symmetry, drag preserves visual state, `prefers-reduced-motion`, focus vs hover paths, click-after-drag suppression.
- **Detail:** Idea: optional **PAT-12 motion-interaction** (or PAT-11 extension): e.g. "grep for `jumpToIdle` on drag", "CTA chip uses same drag wrapper as siblings", "no inline `style` resetting CSS vars Motion animates", reduced-motion instant path. Link from `pb get DEC-29` or ROL-2 when ratified. Prevents multi-hour iterate-and-fix cycles that eval would catch in one pass.
- **PB response:** —

## FB-016 — Extending a Chain-specified component (DEC-38 drag) didn't surface on `pb orient --task` for the new CTA slice
- **Date:** 2026-06-27
- **Type:** wish
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Hero audience chips are drag-to-place (`DEC-38`, `INS-29`). Adding CTA hover sweep to the `you` chip, the implementation branched `{#if accent}` **without** the drag wrapper — regression caught manually. Agent did not run `pb orient --task "AudienceChip CTA join hover"` or `pb get DEC-38` before building; orient for generic "design system" work (FB-015) didn't mention drag constraints on the same component.
- **Detail:** Wish: (1) `pb orient --task` includes **constellation warnings** — "you're editing AudienceCluster; related: DEC-38 drag-to-place, INS-29 transform channels", (2) repo path hints in `.productbrain/briefing.md` → linked DEC/INS when touching `AudienceChip.svelte`, (3) `pb search "AudienceChip drag"` surfaces DEC-38 first. Feature extensions should inherit exclusions from the original bet automatically.
- **PB response:** —

## FB-015 — Governance-dense `pb orient --task` returns a grounding stub; agent must know to `pb get` each ID
- **Date:** 2026-06-27
- **Type:** wish
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** Design-system eval baseline work — `pb orient --task "design system chain eval baseline code vs chain truth"`. Orient matched DEC-11, STD-*, BR-2, etc. (`totalFound: 25`, `taskAlignment: allow`) but response included `"isGroundingStub": true` and `"groundingNote": "…exceeded the summary budget…fetch full context with tier=standard before complex or consequential decisions"`.
- **Detail:** Orient correctly *found* the right entries but did not inline enough STD-1/2/3 body to compare against code without follow-up `pb get` calls. For eval/automation agents, wish: (1) when stub triggers, emit a copy-paste block of recommended `pb get` IDs, (2) `--task` flag like `--full` or `tier=standard` for governance-heavy tasks, or (3) orient JSON field `recommendedGets: ["DEC-11","STD-1",…]` so subagents don't skip retrieval thinking orient was sufficient.
- **PB response:** —

## FB-014 — Domain eval baselines (e.g. design system) aren't discoverable until someone captures a new PAT
- **Date:** 2026-06-27
- **Type:** idea
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** Fresh-agent research to validate DEC-11/STD-1/2/3 against code. PAT-1–5 cover community/Chain queryability; **zero** design-system checks (`lint:ds`, token semantics, icon stack). `pb search "design system eval PAT"` returned governance entries (DEC-11, BR-2) but no eval pattern. Agent had to invent PAT-11 and capture it.
- **Detail:** Idea: (1) eval patterns tagged by domain (`design-system`, `deploy`, `ingest`) queryable via `pb search` or `pb orient --task`, (2) PAT-2 description could reference optional extension PATs (PAT-11 DS checks 22–29) instead of silently staying at "21 checks", (3) onboarding hint when `pb get DEC-11` — "related eval: PAT-11 (when ratified)". Prevents each workspace re-deriving the same eval ladder gaps.
- **PB response:** —

## FB-013 — `pb update` on a verified standard exits non-zero when unknown fields are stripped, even if the update succeeded
- **Date:** 2026-06-27
- **Type:** bug
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** Updating STD-1 to v1.2 (semantic surface tokens, DEC-33 Badge exception, neutral-* ban). Ran `pb update STD-1 -f version=v1.2 -f description="…" -f scope="…"`. JSON response shows description/scope/version **updated** (`updatedAt` changed, searchText reflects new body), but CLI exit code **1** with `"error":"Fields rejected: provisionalAuthorityAnchor."` and `"fieldsRejected": true`.
- **Detail:** Agent/scripts treating non-zero exit as failure may re-run or report failure despite a successful content update. Wish: (1) exit 0 with warnings when partial update succeeds, (2) strip read-only/internal fields server-side without surfacing as VALIDATION_FAILED, or (3) `--strict` vs default lenient mode. Related to FB-001 false-failure theme (SIGPIPE) — agents need trustworthy exit codes.
- **PB response:** —

## FB-012 — `pb get` with many IDs in one invocation is slow; agents background it and lose ordering guarantees
- **Date:** 2026-06-27
- **Type:** wish
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Retrieval pass `pb get DEC-11 STD-1 STD-2 STD-3 BR-2 ROL-2 PAT-1 PAT-2` from repo root. Command exceeded 30s, was backgrounded; only partial JSON returned before timeout in one shell, full output arrived ~80s later in terminal file.
- **Detail:** Eval/subagent workflows need predictable, fast governance retrieval. Wish: (1) `pb get DEC-11 STD-1 --compact` or `--fields=description,rationale` for lighter payloads, (2) documented batch limit or streaming NDJSON, (3) `pb bundle design-system` meta-entry that returns DEC-11+STD-1/2/3+BR-2 in one round-trip (constellation fetch). Reduces agent timeout/backpressure and duplicate `pb get` calls.
- **PB response:** —

## FB-011 — `pb proposals --json` omits proposal `id`; wrong `pb accept` arg returns opaque INTERNAL
- **Date:** 2026-06-26
- **Type:** bug
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** Randy asked to ratify the open ROL-3 governs STD-7 consent proposal. Agent ran `pb proposals` (JSON) — one open proposal, but no `id` field in the payload. Tried `pb accept "create_governs_relation:jx72dqnseryznefhch3gcfswh989d5eb"` using `proposedOperation` from JSON → `{"error":"Internal server error","code":"INTERNAL"}`. `pb proposals --pretty` then showed `ID: md77g3zxdktf7q80ev9rkb2m3d89cy5r`; `pb accept --auto` succeeded.
- **Detail:** (1) JSON output should include the same `id` field that `--pretty` prints, so scripted/agents can call `pb accept <id>` without guessing. (2) Passing `proposedOperation` as the accept arg should fail with a clear message (unknown proposal id), not INTERNAL. (3) Optional: `pb proposals` hint line in default JSON mode ("use --pretty or see id field") — related to FB-006 session-close nudge for pending consent proposals.
- **PB response:** —

## FB-010 — No nudge to retrieve when a new task arrives mid-session → agent rediscovered known Chain knowledge
- **Date:** 2026-06-26
- **Type:** wish
- **For:** both
- **Status:** new
- **Priority:** —
- **Context:** A live Railway deploy failure for funcode.club. The agent went straight into reading build logs and fixed it (adapter-node, Root Directory=`web`, PORT 8080), but never ran `pb orient --task` / `pb search` first — so it **rediscovered** the deploy pipeline already captured in `INS-23` instead of retrieving it. The fixes were captured afterward as `STD-7` + `ROL-3 Deployment`.
- **Detail:** The *Retrieve* in Retrieve→Capture→Retrieve depends on the agent choosing to orient when a task appears **after** the session has already started. `pb orient -b` runs at startup, but a new mid-session task ("fix the deploy") triggers nothing. Wish: (1) a lightweight "new task detected → did you `pb orient --task`?" nudge, or (2) handshake/orient surfacing domain-relevant standards (e.g. a `deployment` domain) more prominently, or (3) a per-domain "retrieve before infra/deploy work" trigger. Root cause is that the retrieval rule is *passive text* the agent must choose to honor — it fails precisely under task urgency, when attention is on the visible fix.
- **Mitigation (FunCode-side):** (a) `CLAUDE.md` + `AGENTS.md` Deployment pointer (`pb get ROL-3 STD-7 INS-23`); and (b) a **deterministic Cursor hook** — `.cursor/hooks/deploy-gate.sh` (`beforeShellExecution`, committed to the repo) that fires on `railway|vercel|netlify|wrangler|flyctl|convex deploy|git push` and returns `permission: ask` with the ROL-3/STD-7 pre-flight checklist. This converts the passive rule into an enforced checkpoint at the command boundary, so the Chain is retrieved *before* a deploy runs rather than rediscovered after. Still leaves the broader gap open: the hook only covers shell-command-shaped deploy work, not general "new task → orient" — a harness-level orient nudge would generalize it.
- **PB response:** —

## FB-009 — `pb promote` requires relevanceScope on standards and business rules
- **Date:** 2026-06-26
- **Type:** wish
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Promoting STD-1/2/3 and BR-2 failed until we ran `pb update <ID> -f relevanceScope=org`. Error message was clear but easy to miss when batch-promoting after capture.
- **Detail:** Wish: (1) capture-time default `relevanceScope=org` for FunCode workspace standards/BRs, or (2) include relevanceScope in `pb fields` required hint on promote failure, or (3) accept `-f relevanceScope=org` on `pb capture -c standards`.
- **PB response:** —

## FB-008 — `pb capture -- -l ID -t type` relations silently dropped; use `pb relate`
- **Date:** 2026-06-26
- **Type:** bug
- **For:** agent
- **Status:** new
- **Priority:** —
- **Context:** Creating atom-sized onboarding decisions (DEC-17..21) with trailing `-- -l DEC-3 -t related_to` on `pb capture`; entries saved but `"relations":[]` until we ran `pb relate` separately.
- **Detail:** Expected capture-time linking from `-- -l <id> -t <type>` flags. Actual: entries created, relations empty. Workaround: `pb relate <from-id> <type> <to-id> --if-missing` after capture. Wish: either wire `-- -l`/`-t` on capture or fail loudly when relation args are ignored.
- **PB response:** —

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
