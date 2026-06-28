<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { checkSharePolicy, recordShareView } from '$lib/data/community/share-policy';
	import { isFeatureEnabled } from '$lib/analytics/feature-flags';
	import { captureEvent } from '$lib/analytics/posthog';

	type Props = {
		data: {
			grant: import('$lib/data/community').ShareGrant;
			collection: import('$lib/data/community').Collection;
			labels: import('$lib/data/community').Label[];
		};
	};

	let { data }: Props = $props();
	const { grant, collection, labels } = $derived(data);

	let policy = $state<ReturnType<typeof checkSharePolicy> | null>(null);
	let premiumSharing = $state(false);

	onMount(() => {
		premiumSharing = isFeatureEnabled('premium-sharing');
		const result = checkSharePolicy(grant);
		if (result.ok) recordShareView(grant);
		policy = result;
		captureEvent('share_link_opened', { token: grant.token, collection: collection.slug });
	});
</script>

<svelte:head>
	<title>{grant.title} — FunCode share</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />

	<main class="mx-auto max-w-3xl px-6 py-14">
		<Badge variant="neutral">Shared collection</Badge>
		<h1 class="mt-4 text-3xl font-black tracking-tight">{collection.name}</h1>
		<p class="mt-3 text-pretty text-ink-soft">{collection.description}</p>

		{#if policy === null}
			<p class="mt-8 text-sm text-ink-soft">Checking link policy…</p>
		{:else if !policy.ok}
			<article class="mt-8 rounded-card border border-border bg-surface-muted p-6">
				<h2 class="font-bold">Link unavailable</h2>
				<p class="mt-2 text-sm text-ink-soft">
					{#if policy.reason === 'expired'}
						This share link has expired.
					{:else}
						This link has reached its view limit.
					{/if}
				</p>
			</article>
		{:else}
			<div class="mt-6 flex flex-wrap gap-2 text-xs text-ink-soft">
				<span>Audience: {grant.audience}</span>
				{#if grant.expiresAt}
					<span>· Expires {new Date(grant.expiresAt).toLocaleDateString()}</span>
				{/if}
				{#if policy.viewsRemaining !== null}
					<span>· {policy.viewsRemaining} views left (this browser)</span>
				{/if}
			</div>

			<section class="mt-10">
				<h2 class="text-sm font-bold tracking-widest text-ink-soft uppercase">
					Labels in this view
				</h2>
				<ul class="mt-4 flex flex-wrap gap-2">
					{#each labels as label (label.slug)}
						<li>
							<Badge variant="accent">{label.name}</Badge>
						</li>
					{/each}
				</ul>
			</section>

			<section class="mt-10">
				<h2 class="text-sm font-bold tracking-widest text-ink-soft uppercase">Chain refs</h2>
				<ul class="mt-4 flex flex-wrap gap-2 font-mono text-sm text-ink-soft">
					{#each collection.chainRefs as ref (ref)}
						<li class="rounded bg-surface-muted px-2 py-1">{ref}</li>
					{/each}
				</ul>
			</section>

			<section class="mt-10 rounded-card border border-border bg-surface-muted p-6">
				<h2 class="font-bold">Where this goes next</h2>
				<p class="mt-2 text-sm text-pretty text-ink-soft">
					Prototype share — like a Google Doc link on a filtered Chain view. Premium policies
					(expiring links, action limits) use
					{#if premiumSharing}
						<strong>premium-sharing</strong> (enabled).
					{:else}
						<strong>premium-sharing</strong> (flag off — basic policy only).
					{/if}
				</p>
				<div class="mt-4 flex flex-wrap gap-3">
					<Button href={resolve('/programs')} variant="soft">Browse programs</Button>
					<Button href={resolve('/media')} variant="soft">Media sources</Button>
				</div>
			</section>
		{/if}
	</main>

	<SiteFooter />
</div>
