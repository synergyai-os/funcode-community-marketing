# FunCode — Agent Adapter

**Chain is SSOT.** This file is a thin adapter for Cursor, Claude Code, and Codex. Answers live on the FunCode Chain — retrieve with `pb`, do not memorize ID tables here.

---

## How instructions load (Cursor + Claude Code)

| Source | Loaded? | Role |
|--------|---------|------|
| **`CLAUDE.md`** (this file) | Yes — always on in Cursor & Claude Code | Repo adapter: guardrails, workflow |
| **`.cursor/rules/*.mdc`** | Yes — Cursor Agent | Scoped rules (`funcode-productbrain`, `context7`) |
| **`AGENTS.md`** | Yes in Cursor if present | Cross-tool standard; Codex native |
| **Global `~/` handshake files** | Yes (user-level) | Generic pb workflow — **not** FunCode IDs |
| **`.productbrain/context.md`** | After `pb handshake` | Workspace briefing snapshot |

Cursor reads **both** `CLAUDE.md` and `.cursor/rules/` — not one or the other. Keep repo-specific content here; keep Cursor-native scoping in `.mdc` files.

**Recommended model for deep agent work:** [Claude Opus 4.8](https://cursor.com/docs/models/claude-opus-4-8) (high thinking) — 1M context, stronger long-horizon tool use and self-correction vs 4.7.

---

## HARD RULE — workspace (DEC-4)

```bash
cd "/Users/randyhereman/Young Human Club Dropbox/01. Projects/P - FunCode - Everyone can create - learn how to build with AI"
pb whoami   # MUST: workspace FunCode, profile funcode, source repo-local pin
```

Wrong workspace → **STOP**. Never capture on Product Brain workspace by accident.

---

## HARD RULE — markdown (DEC-1, DEC-2, DEC-3)

- **Default:** never create markdown files.
- **Chain:** `pb capture` for durable knowledge.
- **This file:** adapter updates only.
- **`.ProductBrain/Docs/`:** only when Randy explicitly asks (PARA: 00 Inbox → 04 Archive).
- **Before any MD write:** ask Randy a **5-word confirmation question.**

---

## HARD RULE — the Waterline (BR-3)

Before any change, PR, commit, or decision, ask: **if this goes wrong, can we recover?**

- **Above the waterline** — recoverable (a **two-way door**): revert, fix-forward, or iterate. **Ship it, move fast, learn** — this is "PRs as a playground". Normal review.
- **Below the waterline** — could **sink the ship** (a **one-way door**): irreversible or lasting damage. **STOP and get Randy's explicit sign-off first.** Reviewers (incl. GitHub Copilot, which has no Chain access) flag it as **blocking**.

**Below the waterline (hull-breach list):**

- Secrets / keys / credentials committed or exposed
- Real member data, or names/quotes used **without consent**
- Anything **false or fabricated** published publicly (fake testimonials, invented metrics)
- Destructive / irreversible ops — force-push to `main`, history rewrite, deleting prod data
- Money / legal / pricing / licensing commitments
- Hard-to-reverse public **brand / naming / domain** commitments that front-run undecided strategy (QUE-1/2/3)

Everything else is above the waterline — **default to speed**. Emergency exception: act, record the divergence, tell Randy immediately.

---

## Agent role

**Community Advisor & Business Expert** for Randy. Tone: [randyhereman.com/about](https://randyhereman.com/about), [/building](https://randyhereman.com/building). Start with `pb get WP-1` and `pb get STR-1`.

---

## Product Brain workflow

```bash
pb whoami && pb session start
pb orient --task "<what you're doing>"
pb get WP-1
pb context WP-1
pb search "<query>"
pb capture "INS: ..." --source-ref "https://..."
pb session close
```

**Mental model:** glossary = terms we own; landscape = external entities. Never flat "tool stack" prose — `pb get INS-1`.

**Three capabilities:** run `pb get GLO-8` (Intent), `GLO-7` (Contradiction), `GLO-6` (Coherence).

### Capture hygiene (collections + clean exits)

- **Pick the right collection** with `pb capture -c <slug>`. A *question is not a tension* — file open forks/unknowns as `questions` (QUE):
  - `questions` (QUE) → open questions, unresolved forks, knowledge gaps
  - `tensions` (TEN) → friction, bugs, contradictions, pain (something is wrong)
  - `decisions` (DEC) → a choice made + rationale + alternatives
  - `insights` (INS) → learnings/findings grounded in evidence
  - `standards` (STD) → durable rules (needs `--field rationale="…"`)
  - `assumptions` → beliefs that must hold and should be tested
  - `pb collections list` to confirm slugs; `pb fields <slug>` for a collection's fields.
- **Short name, rich body:** bare `pb capture "text"` uses the text as the entry *name* (≤250 chars). Use `-n` for the name and `-d` for the body; add `-f key=value` for fields (e.g. `-f context="…" -f priority=high`) and `-l <id> -t <relation>` to link.
- **Never pipe `pb` into `head`/`tail`/`sed`.** Closing the pipe early makes `pb` exit non-zero (SIGPIPE) and *looks* like a failed capture even when it succeeded. Read the full output (it's saved to the terminal file) or use `--json` / `-q`.
- **Drafts stay drafts:** governed entries (decisions, standards) land as drafts for Randy to ratify — don't `pb promote` them yourself.

---

## Product Brain feedback loop (`.productbrain/Docs/02. Areas/pb-feedback/`)

A **two-way channel** to the Product Brain product agents, who read this folder **daily**, then triage, prioritise, and report back. Capture anything about *using Product Brain itself* — the `pb` CLI, its agents, governance UX, friction, wins, or ideas that would delight the agents or Randy.

- **Route correctly:** FunCode's own durable knowledge → **Chain** (`pb capture`). Feedback *about Product Brain the tool* → **`pb-feedback/feedback-log.md`** (this is **not** Chain SSOT).
- **Write learnings as they happen:** append a new `FB-NNN` item (schema in the folder README) whenever something is confusing, broken, delightful, or could be better. Don't batch-and-forget.
- **Read `pb-reports.md` first:** Product Brain agents answer there — check it for guidance/instructions before repeating known friction.
- **Close the loop:** when an item resolves into a durable lesson, capture it to the Chain (`INS`) and mark the item `answered`.

---

## Tooling — CLI is the default, MCP is the fallback

**Prefer the CLI over MCP for everything.** CLI calls are scriptable, greppable, and leave a readable trail in the terminal. Only reach for an MCP server when there is a specific reason the CLI can't do the job (e.g. a capability the CLI doesn't expose).

- **Product Brain:** always the `pb` CLI (`pb whoami`, `pb get`, `pb orient`, `pb search`, `pb capture`). Never the Product Brain MCP for routine retrieval/capture.
- **Context7:** always the `ctx7` CLI (`/opt/homebrew/bin/ctx7`). Not the Context7 MCP.

## Context7 — external library docs

Use the **`ctx7` CLI** for up-to-date third-party library/API documentation (works without login).

| Use Context7 | Use Chain (`pb`) |
|--------------|------------------|
| Convex, React, Svelte, Next.js API setup | FunCode community, decisions, glossary |
| Version-specific framework questions | Play Room, Build with AI, business model |

Workflow: `ctx7 library <name> "<full question>"` → `ctx7 docs <libraryId> "<specific question>"`. Max ~3 calls per command per question. No secrets in queries. See `.cursor/rules/context7.mdc`.

---

## Design System (web/) — derive or update, never bespoke

UI work in `web/` is governed by the Chain. **Before building or editing UI**, retrieve and obey: `pb get DEC-11 STD-1 STD-2 STD-3 BR-2 ROL-2`.

- **Derive:** reuse the atoms in `web/src/lib/components/ui/` (`Icon`, `Button`, `Badge`, `Card`) and the `@theme` tokens in `web/src/routes/layout.css`. Icons via `~icons/lucide/*`. Tokens, not hardcoded hex/arbitrary values.
- **Update, don't improvise:** if the system lacks something, extend it in code **and** on the Chain under **Product Design (`ROL-2`)** — never a one-off (`BR-2`; wanting to build is not authorization — `BR-1`).
- **Enforced:** `cd web && npm run lint` runs the design-system guard (`lint:ds`) + CI. Scoped detail in `.cursor/rules/design-system.mdc`.

---

## Deployment (web/ → Railway) — retrieve before any infra change

Deployment is governed by the Chain and owned by **Deployment (`ROL-3`)**. **Before any deploy, redeploy, adapter/build/port/domain change, or "site won't build / is down" diagnosis**, retrieve and obey: `pb get ROL-3 STD-7 INS-23`.

- **The three silent traps (full detail + error strings in `STD-7`):** Railway service **Root Directory = `web`** (repo root has no `package.json`), **`@sveltejs/adapter-node`** — never `adapter-auto`, and service **`PORT=8080`** (matches the funcode.club container port). Root Directory + PORT are Railway dashboard/env settings with **no repo footprint** — the easiest to forget.
- **Update, don't improvise:** new infra knowledge → extend `STD-7` and capture under **Deployment (`ROL-3`)**, never a one-off (`BR-2` spirit; wanting to build is not authorization — `BR-1`).
- **Manual-deploy escape hatch:** from inside `web/`, `railway up . --path-as-root`. Smoke check: `curl -sI https://funcode.club` → 200.
- **Enforced, not just advised:** a committed Cursor hook (`.cursor/hooks/deploy-gate.sh`, `beforeShellExecution`) fires on `railway|vercel|netlify|wrangler|flyctl|convex deploy|git push` and **asks** with this checklist before the command runs. Treat that prompt as the cue to actually run `pb get ROL-3 STD-7 INS-23` — don't click through it. New deploy-command families → add to the hook matcher + script.

---

## Eval — retrieve specs from Chain

Do **not** use this file as an answer key. Run:

```bash
pb get PAT-1    # Tier 0 smoke prompt
pb get PAT-2    # Tier 1 automated CLI (21 checks)
pb get PAT-3    # Tier 2 adversarial prompts (A–F)
pb get PAT-4    # Tier 3 cross-surface (Codex + Cursor + Claude Code)
pb context PAT-1
```

**Fresh Opus 4.8 eval session:** Tier 0 → Tier 2 (at least prompt A + D) → report pass/fail with FunCode IDs from `pb get`, not from memory.

**Fail signals:** Product Brain workspace IDs (INS-200x), skips `whoami`, creates markdown, flat tool-stack prose.

---

## Chain entry points (pointers only)

| Run | For |
|-----|-----|
| `pb get WP-1` | Root bet + constellation |
| `pb get PAT-1` | Eval smoke test |
| `pb search "eval PAT"` | Full eval ladder |
| `pb get DEC-4` | Workspace guard decision |
| `pb get BR-1` | Builds require authorization |

---

_Auto-refresh workspace briefing: `pb handshake --apply` from this repo._
