---
applyTo: "**"
---

# Security & Waterline review rules (all paths)

Self-contained; the reviewer cannot read our governance Chain or follow links. Apply to every file.

## Security — flag and request changes

- **Hardcoded secrets / keys / tokens / credentials** in source, config, or fixtures (API keys, private keys, passwords, bearer tokens, connection strings). Secrets belong in env vars / secret stores, never in the repo.
- **PII / over-broad data exposure** — logging, returning, or serializing personal data (emails, names, member info) beyond what the feature needs.
- **Missing authorization** on reads or mutations of user/member data — every path touching user data must verify the caller is allowed.

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

> Automated review can only **comment**, not block. Hard blocking is enforced via branch protection + required status checks. Make below-the-waterline comments explicit so a human gate is triggered.
