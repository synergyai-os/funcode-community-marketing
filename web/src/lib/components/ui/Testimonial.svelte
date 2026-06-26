<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Avatar from './Avatar.svelte';
	import IconQuote from '~icons/lucide/quote';

	type Props = HTMLAttributes<HTMLElement> & {
		quote: string;
		/** Full name of the person; also drives the avatar initials. */
		name: string;
		/** Short role/segment, e.g. "Product manager". */
		role: string;
	};

	let { quote, name, role, class: className = '', ...rest }: Props = $props();
</script>

<figure
	class={`flex h-full flex-col rounded-card border border-neutral-200 bg-white p-7 shadow-card sm:p-8 ${className}`}
	{...rest}
>
	<IconQuote class="size-7 text-accent" aria-hidden="true" />
	<blockquote class="mt-5 grow text-lg leading-relaxed text-pretty text-ink">{quote}</blockquote>
	<figcaption class="mt-7 flex items-center gap-3">
		<Avatar {name} shape="rounded" size="lg" />
		<span class="leading-tight">
			<span class="block font-semibold text-ink">{name}</span>
			<span class="block text-sm text-ink-soft">{role}</span>
		</span>
	</figcaption>
</figure>
