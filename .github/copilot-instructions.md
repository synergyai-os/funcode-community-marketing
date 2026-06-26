# GitHub Copilot — code review instructions (FunCode)

> Self-contained on purpose. Copilot's code review reads this from the PR **base** branch and **cannot access our governance Chain or follow links**. All rules needed to review are restated here.

## Project context

- **FunCode — Build with AI**: a free, public community teaching people to build with AI. Public repo, ~10 contributors.
- Frontend lives in `web/` — **SvelteKit 2, Svelte 5 (runes), Tailwind v4**.
- Governance ("the Chain") lives in an external system the reviewer can't see; the rules that matter for review are summarized below.
- Default posture: **"PRs as a playground" — recoverable changes should ship fast.** Reserve blocking feedback for genuine correctness, security, and "below-the-waterline" issues (see below).

## Review priorities (in order)

1. **Correctness** — logic errors, broken edge cases, unhandled async/promise rejections, runtime crashes.
2. **Security** — see the dedicated section; flag and request changes.
3. **Consistency with existing patterns** — match the conventions already in the touched files/folders rather than introducing new ones.
4. **Tests** — new behavior or bug fixes should have tests where the area is already tested; flag missing coverage for risky logic.

## Security — flag and request changes

- **Hardcoded secrets / keys / tokens / credentials** in source, config, or fixtures (API keys, private keys, passwords, bearer tokens, connection strings).
- **PII / over-broad data exposure** — logging, returning, or serializing personal data (emails, names, member info) beyond what the feature needs.
- **Missing authorization** on reads or mutations of user/member data — every endpoint or function touching user data must verify the caller is allowed.

## The Waterline — below-the-waterline changes need explicit human sign-off

Ask: **if this goes wrong, can we recover?**

- **Above the waterline** — recoverable / two-way door (revert, fix-forward, iterate). Default to speed; normal review.
- **Below the waterline** — could sink the ship / one-way door. **Flag as needing explicit sign-off from the maintainer (Randy) before merge.**

**Below-the-waterline (hull-breach) list — flag any of these:**

- Secrets / keys / credentials committed or exposed
- Real member data, or names / quotes used **without consent**
- Anything **false or fabricated** published publicly (fake testimonials, invented metrics)
- Destructive / irreversible ops — force-push to `main`, history rewrite, deleting prod data
- Money / legal / pricing / licensing commitments
- Hard-to-reverse public **brand / naming / domain** commitments

Everything else is above the waterline — default to speed.

> Copilot can only **comment**; it cannot block. Hard blocking is enforced separately via branch protection + required status checks. Make below-the-waterline comments explicit and unambiguous so a human gate is triggered.

## Design system (`web/**`)

UI is governed: **derive from the design system, never bespoke.** Flag and request changes for:

- **Hardcoded hex colors** (e.g. `#fff`, `#1a1a1a`) or **arbitrary Tailwind values** for themed properties (e.g. `bg-[#123456]`, `text-[14px]` where a token exists). Require `@theme` tokens (`bg-accent`, `text-ink`, `rounded-card`, …).
- **Inline `<svg>`** — require the `Icon` atom / `~icons/lucide/*` instead.
- **Raw `<button>`** — require the `Button` atom from `web/src/lib/components/ui/`.
- **CSS animations / transitions without a `prefers-reduced-motion` guard** — motion must be pausable/reduced for accessibility.

Require reuse of the atoms in `web/src/lib/components/ui/` and the tokens in `web/src/routes/layout.css`.

## Out of scope (do not comment on)

- Pure **formatting / style** — handled by Prettier and ESLint.
- **Generated files** (e.g. `web/.svelte-kit/`, build output).
- **Lock files** (`package-lock.json`, etc.).
