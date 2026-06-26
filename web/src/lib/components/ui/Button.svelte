<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	// Extend native button + anchor attributes so aria-*, data-*, disabled, rel,
	// target, etc. pass through type-checked. Renders <a> when `href` is set.
	type Props = HTMLButtonAttributes &
		HTMLAnchorAttributes & {
			variant?: Variant;
			size?: Size;
			children: Snippet;
			/** Icon or content rendered before the label. */
			leading?: Snippet;
			/** Icon or content rendered after the label. */
			trailing?: Snippet;
		};

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		class: className = '',
		children,
		leading,
		trailing,
		...rest
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:-translate-y-0.5';

	const variants: Record<Variant, string> = {
		primary: 'bg-accent-strong text-white shadow-card hover:bg-accent-strong-hover',
		secondary: 'border border-neutral-300 text-ink hover:bg-neutral-50',
		ghost: 'text-ink hover:bg-neutral-100'
	};

	const sizes: Record<Size, string> = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-2.5 text-sm',
		lg: 'px-8 py-3.5 text-base'
	};

	const classes = $derived(`${base} ${variants[variant]} ${sizes[size]} ${className}`);
</script>

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href-agnostic atom: external, hash, or internal links -->
	<a {href} class={classes} {...rest}>
		{@render leading?.()}
		{@render children()}
		{@render trailing?.()}
	</a>
{:else}
	<button {type} class={classes} {...rest}>
		{@render leading?.()}
		{@render children()}
		{@render trailing?.()}
	</button>
{/if}
