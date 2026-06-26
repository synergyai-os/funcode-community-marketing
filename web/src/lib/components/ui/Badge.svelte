<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'accent' | 'neutral';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		variant?: Variant;
		/** Renders a small leading status dot. */
		dot?: boolean;
		children: Snippet;
	};

	let {
		variant = 'neutral',
		dot = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, { pill: string; dot: string }> = {
		accent: { pill: 'border-accent-soft bg-accent-soft text-accent-strong', dot: 'bg-accent' },
		neutral: { pill: 'border-neutral-200 bg-white/70 text-neutral-600', dot: 'bg-accent' }
	};
</script>

<span
	class={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase backdrop-blur ${variants[variant].pill} ${className}`}
	{...rest}
>
	{#if dot}
		<span class={`h-2 w-2 rounded-full ${variants[variant].dot}`}></span>
	{/if}
	{@render children()}
</span>
