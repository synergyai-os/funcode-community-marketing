---
applyTo: "web/**"
---

# Frontend review rules (`web/**`)

SvelteKit 2 + Svelte 5 (runes) + Tailwind v4. Self-contained; the reviewer cannot read our governance Chain.

## Svelte 5 runes idiom

- Use runes: `$props()`, `$state()`, `$derived()`, `$effect()`. **Flag legacy patterns**: `export let`, `$:` reactive statements, `on:event` directives (use `onevent`), `createEventDispatcher`, and stores-as-local-state where a rune fits.
- Pass children/slots as `Snippet` props and render with `{@render ...}`; flag old `<slot>` usage in new components.

## Atom prop contract

- New UI atoms in `web/src/lib/components/ui/` must **extend the native element attributes** (e.g. `HTMLButtonAttributes`, `HTMLAnchorAttributes` from `svelte/elements`) and **spread `{...rest}`** onto the rendered element, so `aria-*`, `data-*`, `disabled`, `type`, etc. pass through type-checked.
- Flag atoms that hardcode/omit native attributes instead of extending + spreading.

## Accessibility (WCAG 2.2 AA)

- **Motion is pausable / reduced**: any animation or transition must respect `prefers-reduced-motion`; auto-playing/looping motion needs a pause control.
- **Keyboard-operable**: interactive elements reachable and operable by keyboard; scrollable regions keyboard-scrollable; visible focus states preserved.
- **Landmarks & skip link**: pages expose proper landmarks and a skip-to-content link; don't remove them.
- Flag missing/incorrect roles, labels, and focus management.

## Design tokens, not hardcoded values

- Use `@theme` tokens from `web/src/routes/layout.css` (`bg-accent`, `text-ink`, `rounded-card`, …). **Flag** hardcoded hex and arbitrary Tailwind `[...]` values for themed properties.

## Icons

- Render icons through the `Icon` atom or `~icons/lucide/*`. Decorative icons must be `aria-hidden`; meaningful icons need an accessible label. **Flag** inline `<svg>`.
