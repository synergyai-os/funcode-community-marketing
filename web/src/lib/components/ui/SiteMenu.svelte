<script lang="ts">
	import { animate, stagger } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';
	import { canUseWebAnimations } from '$lib/motion/capabilities';
	import type { Snippet } from 'svelte';
	import type { NavGroup } from '$lib/data/site-nav';
	import NavGroupSection from './NavGroup.svelte';
	import Button from './Button.svelte';
	import IconX from '~icons/lucide/x';

	type Mode = 'overlay' | 'dropdown';

	type Props = {
		open?: boolean;
		groups: NavGroup[];
		mode?: Mode;
		/** When `parent`, dropdown panel is relatively positioned (wrapper handles placement). */
		dropdownAnchor?: 'self' | 'parent';
		onClose?: () => void;
		footer?: Snippet;
	};

	let {
		open = $bindable(false),
		groups,
		mode = 'overlay',
		dropdownAnchor = 'self',
		onClose,
		footer
	}: Props = $props();

	const dropdownPanelClass = $derived(
		dropdownAnchor === 'parent'
			? 'site-menu-panel relative w-[min(100vw-2rem,24rem)] rounded-card border border-border bg-surface p-4 shadow-card-lifted'
			: 'site-menu-panel absolute top-full right-0 z-50 mt-2 w-[min(100vw-2rem,24rem)] rounded-card border border-border bg-surface p-4 shadow-card-lifted'
	);

	const reducedMotion = $derived(prefersReducedMotion.current);
	const canAnimate = $derived(canUseWebAnimations());

	let backdropEl = $state<HTMLDivElement | null>(null);
	let panelEl = $state<HTMLElement | null>(null);

	function close() {
		open = false;
		onClose?.();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}

	function lockScroll(active: boolean) {
		if (typeof document === 'undefined' || mode !== 'overlay') return;
		document.body.style.overflow = active ? 'hidden' : '';
	}

	$effect(() => {
		if (mode !== 'overlay') return;
		lockScroll(open);
		return () => lockScroll(false);
	});

	$effect(() => {
		if (!open || !canAnimate || reducedMotion || !panelEl) return;

		const panelAnim = animate(
			panelEl,
			mode === 'overlay'
				? { x: ['100%', '0%'] }
				: { opacity: [0, 1], y: [-8, 0] },
			{
				type: 'spring',
				stiffness: mode === 'overlay' ? 240 : 220,
				damping: mode === 'overlay' ? 32 : 30
			}
		);

		const pillars = panelEl.querySelectorAll<HTMLElement>('[data-nav-pillar]');
		const pillarAnim =
			pillars.length > 0
				? animate(
						pillars,
						{ opacity: [0, 1], y: [8, 0] },
						{ duration: 0.25, delay: stagger(0.05), ease: [0.22, 1, 0.36, 1] }
					)
				: null;

		return () => {
			panelAnim.cancel();
			pillarAnim?.cancel();
		};
	});

	$effect(() => {
		if (!open || mode !== 'overlay' || !backdropEl) return;
		if (canAnimate && !reducedMotion) {
			backdropEl.style.opacity = '0';
			const anim = backdropEl.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 200,
				easing: 'ease-out',
				fill: 'forwards'
			});
			return () => anim.cancel();
		}
		backdropEl.style.opacity = '1';
	});
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	{#if mode === 'overlay'}
		<div
			bind:this={backdropEl}
			class="site-menu-backdrop fixed inset-0 z-40"
			role="presentation"
			onclick={close}
		></div>
	{/if}

	<nav
		bind:this={panelEl}
		id={mode === 'overlay' ? 'site-menu-overlay' : undefined}
		class={
			mode === 'overlay'
				? 'site-menu-panel fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-card-lifted'
				: dropdownPanelClass
		}
		aria-label={mode === 'overlay' ? 'Site menu' : 'Navigation group'}
	>
		{#if mode === 'overlay'}
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<p class="text-sm font-semibold text-ink">Where do you want to go?</p>
				<Button variant="ghost" size="icon" aria-label="Close menu" onclick={close}>
					<IconX class="size-5" aria-hidden="true" />
				</Button>
			</div>
		{/if}

		<div class="flex-1 space-y-5 overflow-y-auto px-4 py-4">
			{#each groups as group (group.id)}
				<NavGroupSection {group} onNavigate={close} />
			{/each}
		</div>

		{#if footer}
			<div class="border-t border-border p-5">{@render footer()}</div>
		{/if}
	</nav>
{/if}

<style>
	.site-menu-backdrop {
		background: color-mix(in srgb, var(--color-ink) 55%, transparent);
		backdrop-filter: blur(4px);
	}

	@media (prefers-reduced-motion: reduce) {
		.site-menu-panel,
		.site-menu-backdrop {
			transition: none !important;
		}
	}
</style>
