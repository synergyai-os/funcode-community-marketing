<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AppRoute } from '$lib/data/learn-nav';
	import IconArrowLeft from '~icons/lucide/arrow-left';

	type Props = {
		title?: string;
		backHref?: AppRoute | '/';
		backLabel?: string;
		eyebrow?: string;
	};

	let { title, backHref = '/', backLabel = 'Home', eyebrow }: Props = $props();
</script>

<div class="border-b border-border bg-surface-muted">
	<div class="mx-auto max-w-4xl px-6 py-4">
		<a
			href={resolve(backHref)}
			class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-accent"
		>
			<IconArrowLeft class="size-4" aria-hidden="true" />
			{backLabel}
		</a>
		{#if eyebrow || title}
			<div class="mt-6 pb-8">
				{#if eyebrow}
					<p class="text-xs font-bold tracking-widest text-ink-soft uppercase">{eyebrow}</p>
				{/if}
				{#if title}
					<h1 class="mt-2 text-3xl font-black tracking-tight text-balance sm:text-4xl">{title}</h1>
				{/if}
			</div>
		{/if}
	</div>
</div>
