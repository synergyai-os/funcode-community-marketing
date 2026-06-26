<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Size = 'sm' | 'md' | 'lg';
	type Shape = 'circle' | 'rounded';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		/** Full name; initials are derived from the first two words. */
		name: string;
		size?: Size;
		/** Silhouette: a full circle (default) or a rounded square. */
		shape?: Shape;
	};

	let { name, size = 'md', shape = 'circle', class: className = '', ...rest }: Props = $props();

	const sizes: Record<Size, string> = {
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base'
	};

	const shapes: Record<Shape, string> = {
		circle: 'rounded-full',
		rounded: 'rounded-xl'
	};

	const initials = $derived(
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((word) => word[0]?.toUpperCase() ?? '')
			.join('')
	);
</script>

<span
	class={`inline-grid shrink-0 place-items-center bg-accent-soft font-bold text-ink ${shapes[shape]} ${sizes[size]} ${className}`}
	{...rest}
	aria-hidden="true"
>
	{initials}
</span>
