<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Avatar from './Avatar.svelte';
	import IconQuote from '~icons/lucide/quote';
	import IconExternalLink from '~icons/lucide/external-link';

	type Props = HTMLAttributes<HTMLElement> & {
		quote: string;
		/** Full name of the person; also drives the avatar initials. */
		name: string;
		/** Authority under the name — title, company, or segment (STD-6). */
		role: string;
		/** Voice cards: episode/source link in header (desktop) or below quote (mobile). */
		sourceHref?: string;
		sourceLabel?: string;
		variant?: 'member' | 'voice';
	};

	let {
		quote,
		name,
		role,
		sourceHref,
		sourceLabel,
		variant = 'member',
		class: className = '',
		...rest
	}: Props = $props();

	const isVoice = $derived(variant === 'voice');
	const showSource = $derived(isVoice && sourceHref && sourceLabel);
</script>

<figure
	class={`flex h-full flex-col rounded-card border border-neutral-200 bg-white p-7 shadow-card sm:p-8 ${className}`}
	{...rest}
>
	<div class="flex items-start justify-between gap-4">
		<IconQuote class="size-7 shrink-0 text-accent" aria-hidden="true" />
		{#if showSource}
			<a
				href={sourceHref}
				target="_blank"
				rel="noopener noreferrer"
				class="hidden max-w-[55%] items-center gap-1 text-right text-xs font-semibold tracking-wide text-accent-strong uppercase underline-offset-2 hover:underline sm:inline-flex"
			>
				<span class="truncate">{sourceLabel}</span>
				<IconExternalLink class="size-3.5 shrink-0" aria-hidden="true" />
				<span class="sr-only"> (opens in a new tab)</span>
			</a>
		{/if}
	</div>
	<blockquote class="mt-5 grow text-lg leading-relaxed text-pretty text-ink">{quote}</blockquote>

	{#if showSource}
		<a
			href={sourceHref}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-accent-strong uppercase underline-offset-2 hover:underline sm:hidden"
		>
			<span>{sourceLabel}</span>
			<IconExternalLink class="size-3.5 shrink-0" aria-hidden="true" />
			<span class="sr-only"> (opens in a new tab)</span>
		</a>
	{/if}

	<figcaption class="mt-7 flex items-center gap-3">
		<Avatar {name} shape="rounded" size="lg" />
		<span class="leading-tight">
			<span class="block font-semibold text-ink">{name}</span>
			<span class="block text-sm text-ink-soft">{role}</span>
		</span>
	</figcaption>
</figure>
