<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'solid' | 'accent' | 'neutral';
	type Size = 'sm' | 'lg';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		variant?: Variant;
		size?: Size;
		/** Renders a small leading status dot. */
		dot?: boolean;
		/** When combined with `dot`, the dot emits a live "ping" ring — a signal of
		 *  activity (e.g. a hero eyebrow that should read as alive, not static). */
		pulse?: boolean;
		children: Snippet;
	};

	let {
		variant = 'neutral',
		size = 'sm',
		dot = false,
		pulse = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, { pill: string; dot: string }> = {
		solid: { pill: 'border-accent bg-accent text-white', dot: 'bg-white' },
		accent: { pill: 'border-accent-soft bg-accent-soft text-accent-strong', dot: 'bg-accent' },
		neutral: { pill: 'border-border bg-surface/70 text-muted-soft', dot: 'bg-accent' }
	};

	const sizes: Record<Size, { pill: string; dot: string }> = {
		sm: { pill: 'gap-2 px-4 py-1.5 text-xs', dot: 'size-2' },
		lg: { pill: 'gap-2.5 px-5 py-2 text-sm', dot: 'size-2.5' }
	};
</script>

<span
	class={`inline-flex items-center rounded-full border font-semibold tracking-wide uppercase backdrop-blur ${variants[variant].pill} ${sizes[size].pill} ${className}`}
	{...rest}
>
	{#if dot}
		<span class={`relative flex ${sizes[size].dot}`}>
			{#if pulse}
				<span
					class={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden ${variants[variant].dot}`}
				></span>
			{/if}
			<span class={`relative inline-flex h-full w-full rounded-full ${variants[variant].dot}`}
			></span>
		</span>
	{/if}
	{@render children()}
</span>
