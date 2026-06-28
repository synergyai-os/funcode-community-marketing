<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui';
	import { getJoinContext } from '$lib/context/join';
	import { learnNavLinks, learnNavSecondary } from '$lib/data/learn-nav';
	import IconMenu from '~icons/lucide/menu';
	import IconX from '~icons/lucide/x';

	type Props = {
		homeAnchors?: boolean;
	};

	let { homeAnchors = false }: Props = $props();

	const join = getJoinContext();
	let drawerOpen = $state(false);

	function closeDrawer() {
		drawerOpen = false;
	}

	function openJoin() {
		closeDrawer();
		join.openJoin();
	}
</script>

<header class="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
		<a href={resolve('/')} class="flex shrink-0 items-center gap-2 font-extrabold tracking-tight">
			<span class="grid h-8 w-8 place-items-center rounded-lg bg-ink text-white">&lt;/&gt;</span>
			<span>FunCode</span>
		</a>

		<nav class="hidden items-center gap-5 text-sm font-medium lg:flex" aria-label="Main">
			{#if homeAnchors}
				<a class="text-ink-soft transition hover:text-ink" href="#how">How it works</a>
			{/if}
			{#each learnNavLinks as link (link.href)}
				<a class="text-ink-soft transition hover:text-ink" href={resolve(link.href)}>{link.label}</a
				>
			{/each}
			{#if homeAnchors}
				<a class="text-ink-soft transition hover:text-ink" href="#faq">FAQ</a>
			{/if}
		</nav>

		<div class="flex items-center gap-2">
			<Button variant="primary" size="sm" class="hidden sm:inline-flex" onclick={openJoin}>
				Join — free
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="lg:hidden"
				aria-expanded={drawerOpen}
				aria-controls="mobile-nav"
				aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (drawerOpen = !drawerOpen)}
			>
				{#if drawerOpen}
					<IconX class="size-5" aria-hidden="true" />
				{:else}
					<IconMenu class="size-5" aria-hidden="true" />
				{/if}
			</Button>
		</div>
	</div>

	{#if drawerOpen}
		<nav
			id="mobile-nav"
			class="border-t border-border bg-surface px-6 py-4 lg:hidden"
			aria-label="Mobile"
		>
			<ul class="space-y-1">
				{#each learnNavLinks as link (link.href)}
					<li>
						<a
							class="block rounded-card px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-surface-muted hover:text-ink"
							href={resolve(link.href)}
							onclick={closeDrawer}
						>
							{link.label}
						</a>
					</li>
				{/each}
				<li class="pt-2">
					<p class="px-3 pb-1 text-xs font-bold tracking-widest text-muted uppercase">More</p>
				</li>
				{#each learnNavSecondary as link (link.href)}
					<li>
						<a
							class="block rounded-card px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-surface-muted hover:text-ink"
							href={resolve(link.href)}
							onclick={closeDrawer}
						>
							{link.label}
						</a>
					</li>
				{/each}
				{#if homeAnchors}
					<li>
						<a
							class="block rounded-card px-3 py-2.5 text-sm font-medium text-ink-soft"
							href="#how"
							onclick={closeDrawer}>How it works</a
						>
					</li>
					<li>
						<a
							class="block rounded-card px-3 py-2.5 text-sm font-medium text-ink-soft"
							href="#faq"
							onclick={closeDrawer}>FAQ</a
						>
					</li>
				{/if}
				<li class="pt-3">
					<Button variant="primary" size="md" class="w-full" onclick={openJoin}>Join — free</Button>
				</li>
			</ul>
		</nav>
	{/if}
</header>
