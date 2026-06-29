<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Component } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { AppRoute } from '$lib/data/site-nav';
	import Icon from './Icon.svelte';

	type Props = HTMLAnchorAttributes & {
		label: string;
		href: AppRoute;
		description: string;
		icon: Component;
		onNavigate?: () => void;
	};

	let {
		label,
		href,
		description,
		icon,
		onNavigate,
		class: className = '',
		...rest
	}: Props = $props();
</script>

<a
	href={resolve(href)}
	data-nav-pillar
	class={`group -mx-2 flex gap-3 rounded-lg px-2 py-4 transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
	onclick={onNavigate}
	{...rest}
>
	<div
		class="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft/70 text-accent-strong"
		aria-hidden="true"
	>
		<Icon {icon} size={18} />
	</div>
	<div class="min-w-0 flex-1">
		<span class="block text-base font-semibold text-ink">{label}</span>
		<p class="mt-0.5 text-sm leading-snug text-muted">{description}</p>
	</div>
</a>
