<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Size = 'sm' | 'md' | 'lg';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		/** Full name; initials are derived from the first two words. */
		name: string;
		size?: Size;
	};

	let { name, size = 'md', class: className = '', ...rest }: Props = $props();

	const sizes: Record<Size, string> = {
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base'
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
	class={`inline-grid shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-ink ${sizes[size]} ${className}`}
	aria-hidden="true"
	{...rest}
>
	{initials}
</span>
