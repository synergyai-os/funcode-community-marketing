# FunCode — Agent Guide (canonical)

**FunCode — Build with AI** is a free community that teaches people to build with AI. The frontend lives in `web/` (SvelteKit 2, Svelte 5, Tailwind v4).

This file is the **vendor-neutral, canonical** agent guide — read natively by Codex, Cursor, and GitHub Copilot. Governance lives on an external **Product Brain "Chain"** accessed via the local `pb` CLI: **the Chain is the single source of truth (SSOT).** `CLAUDE.md` is the Cursor/Claude Code adapter and mirrors the rules here.

---

## HARD RULE — workspace

Run every `pb` command from the **repo root**, and verify the workspace first:

```bash
pb whoami   # MUST show: workspace FunCode, profile funcode, source repo-local pin
```

Wrong workspace → **STOP**. Never capture against the wrong Chain by accident.

---

## HARD RULE — the Waterline (BR-3)

Before any change, PR, commit, or decision, ask: **if this goes wrong, can we recover?**

- **Above the waterline** — recoverable, a **two-way door** (revert, fix-forward, iterate). **Ship it, move fast, learn** — this is "PRs as a playground." Normal review.
- **Below the waterline** — could **sink the ship**, a **one-way door** (irreversible or lasting damage). **STOP and get Randy's explicit sign-off first.** Reviewers — including GitHub Copilot, which has no Chain access — flag it as **blocking**.

**Below the waterline (hull-breach list):**

- Secrets / keys / credentials committed or exposed
- Real member data, or names / quotes used **without consent**
- Anything **false or fabricated** published publicly (fake testimonials, invented metrics)
- Destructive / irreversible ops — force-push to `main`, history rewrite, deleting prod data
- Money / legal / pricing / licensing commitments
- Hard-to-reverse public **brand / naming / domain** commitments

Everything else is **above the waterline — default to speed.** Emergency exception: act, record the divergence, tell Randy immediately.

---

## Capture hygiene

- Pick the right collection with `pb capture -c <slug>`; run `pb collections list` to confirm slugs and `pb fields <slug>` for a collection's fields.
- A *question is not a tension*: file open forks/unknowns as `questions` (QUE), not `tensions` (TEN).
- **Drafts stay drafts:** governed entries (decisions, standards) land as drafts for Randy to ratify — don't promote them yourself.

---

## Design system (web/)

UI is governed: **derive from the design system, never bespoke.**

- Reuse the atoms in `web/src/lib/components/ui/` (`Icon`, `Button`, `Badge`, `Card`, …) and the `@theme` tokens in `web/src/routes/layout.css`. Tokens, not hardcoded hex or arbitrary `[...]` values. Icons via `~icons/lucide/*`, never inline `<svg>`.
- If the system lacks something, **extend it** (in code + on the Chain under Product Design) — never a one-off.
- Enforced: `cd web && npm run lint` runs the design-system guard (`lint:ds`) and also runs in CI.

---

## Keeping these files in sync

- **`AGENTS.md` (this file) is canonical.** Edit governance/agent guidance here first.
- `CLAUDE.md` and `.cursor/rules/*.mdc` are managed via **`pb handshake`** — refresh them from the Chain, don't hand-edit the generated sections.
- **`.github/copilot-instructions.md` must be kept in sync by hand**: GitHub Copilot's code review reads it from the PR base branch and **cannot read the Chain or follow links**, so the Waterline and security rules are restated self-contained there. When those rules change here, update the Copilot files too.
