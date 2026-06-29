<script lang="ts">
	import { resolve } from '$app/paths';
	import { siteNav, type NavGroupId } from '$lib/data/site-nav';
	import { getJoinContext } from '$lib/context/join';
	import Button from './Button.svelte';
	import SiteMenu from './SiteMenu.svelte';
	import IconChevronDown from '~icons/lucide/chevron-down';
	import IconMenu from '~icons/lucide/menu';
	import IconX from '~icons/lucide/x';

	type Props = {
		homeAnchors?: boolean;
	};

	let { homeAnchors = false }: Props = $props();

	const join = getJoinContext();
	let overlayOpen = $state(false);
	let activeGroupId = $state<NavGroupId | null>(null);
	let closeGroupTimer: ReturnType<typeof setTimeout> | undefined;

	function openGroup(id: NavGroupId) {
		if (closeGroupTimer) clearTimeout(closeGroupTimer);
		closeGroupTimer = undefined;
		activeGroupId = id;
		overlayOpen = false;
	}

	function scheduleCloseGroup() {
		if (closeGroupTimer) clearTimeout(closeGroupTimer);
		closeGroupTimer = setTimeout(() => {
			activeGroupId = null;
			closeGroupTimer = undefined;
		}, 120);
	}

	function onGroupFocusOut(event: FocusEvent, groupId: NavGroupId) {
		if (activeGroupId !== groupId) return;
		const next = event.relatedTarget;
		if (next instanceof Node && event.currentTarget instanceof Node && event.currentTarget.contains(next)) {
			return;
		}
		scheduleCloseGroup();
	}

	function openOverlay() {
		activeGroupId = null;
		overlayOpen = true;
	}

	function closeMenus() {
		overlayOpen = false;
		activeGroupId = null;
	}

	function openJoin() {
		closeMenus();
		join.openJoin();
	}

	/** Shared text-link styling for all desktop nav items (groups + anchors). Not button pills. */
	const navItemClass =
		'nav-item !rounded-none !shadow-none hover:!translate-y-0 hover:!bg-transparent px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink data-[active=true]:text-ink';
</script>

<header class="site-chrome sticky top-0 z-30 px-4 pt-3">
	<div
		class="site-chrome-bar mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-card border border-border/70 bg-gradient-to-r from-accent-soft/50 via-surface/95 to-surface/90 px-4 py-3 shadow-card backdrop-blur-md sm:gap-4 sm:px-5"
	>
		<a href={resolve('/')} class="flex shrink-0 items-center gap-2 font-extrabold tracking-tight">
			<span
				class="grid size-9 place-items-center rounded-lg bg-ink font-mono text-sm text-white sm:size-8"
				aria-hidden="true">&lt;/&gt;</span
			>
			<span class="text-base sm:text-inherit">FunCode</span>
		</a>

		<nav class="relative hidden items-center gap-0.5 lg:flex" aria-label="Main">
			{#each siteNav as group (group.id)}
				<div
					class="nav-group relative"
					onmouseenter={() => openGroup(group.id)}
					onmouseleave={scheduleCloseGroup}
					onfocusin={() => openGroup(group.id)}
					onfocusout={(event) => onGroupFocusOut(event, group.id)}
				>
					<Button
						variant="ghost"
						size="sm"
						class={navItemClass}
						data-active={activeGroupId === group.id}
						aria-expanded={activeGroupId === group.id}
						aria-haspopup="true"
					>
						{group.label}
						{#snippet trailing()}
							<IconChevronDown
								class={`size-3.5 opacity-70 transition-transform duration-200 ${activeGroupId === group.id ? 'rotate-180' : ''}`}
								aria-hidden="true"
							/>
						{/snippet}
					</Button>
					{#if activeGroupId === group.id}
						<div class="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
							<SiteMenu
								open={true}
								groups={[group]}
								mode="dropdown"
								dropdownAnchor="parent"
								onClose={() => (activeGroupId = null)}
							/>
						</div>
					{/if}
				</div>
			{/each}
			{#if homeAnchors}
				<a class={navItemClass} href="#how">How it works</a>
				<a class={navItemClass} href="#faq">FAQ</a>
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
				aria-expanded={overlayOpen}
				aria-controls="site-menu-overlay"
				aria-label={overlayOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (overlayOpen ? closeMenus() : openOverlay())}
			>
				{#if overlayOpen}
					<IconX class="size-5" aria-hidden="true" />
				{:else}
					<IconMenu class="size-5" aria-hidden="true" />
				{/if}
			</Button>
		</div>
	</div>

	<SiteMenu bind:open={overlayOpen} groups={siteNav} mode="overlay" onClose={closeMenus}>
		{#snippet footer()}
			<Button variant="primary" size="md" class="w-full" onclick={openJoin}>Join — free</Button>
		{/snippet}
	</SiteMenu>
</header>

<svelte:window
	onclick={(event) => {
		if (!activeGroupId) return;
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (!(target instanceof Element)) return;
		if (
			target.closest('.site-menu-panel') ||
			target.closest('.site-chrome-bar') ||
			target.closest('.nav-group')
		) {
			return;
		}
		activeGroupId = null;
	}}
/>

<style>
	.site-chrome-bar {
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--color-accent-soft) 55%, transparent),
			color-mix(in srgb, var(--color-surface) 95%, transparent) 45%,
			color-mix(in srgb, var(--color-surface) 88%, transparent)
		);
	}
</style>
