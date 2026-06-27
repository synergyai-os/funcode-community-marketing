<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	// `title` is overloaded as the card heading, so omit the native title attribute.
	type Props = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
		/** Optional icon component, e.g. `import IconGift from '~icons/lucide/gift'`. */
		icon?: Component;
		title: string;
		children: Snippet;
	};

	let { icon, title, class: className = '', children, ...rest }: Props = $props();
</script>

<article
	class={`group rounded-card border border-border bg-surface p-8 transition hover:-translate-y-1 hover:border-border-strong hover:shadow-card ${className}`}
	{...rest}
>
	{#if icon}
		<div
			class="mb-5 grid size-12 place-items-center rounded-card bg-accent-soft text-accent transition-transform group-hover:scale-105"
		>
			<Icon {icon} size={24} />
		</div>
	{:else}
		<div class="mb-5 h-1 w-10 rounded-full bg-accent transition-all group-hover:w-16"></div>
	{/if}

	<h3 class="text-xl font-bold">{title}</h3>
	<p class="mt-3 text-ink-soft">{@render children()}</p>
</article>
