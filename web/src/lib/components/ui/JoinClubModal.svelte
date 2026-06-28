<script lang="ts">
	import Badge from './Badge.svelte';
	import Button from './Button.svelte';
	import IconX from '~icons/lucide/x';
	import IconArrowRight from '~icons/lucide/arrow-right';

	type Props = {
		open?: boolean;
		/** Where to send people after a successful capture (optional deep-link). */
		joinUrl?: string;
		/** Stay on site — store email locally, no external redirect. */
		captureOnly?: boolean;
		/** Why the modal opened — e.g. host-meetup, rsvp. */
		intent?: string;
		onCaptured?: (email: string) => void;
	};

	let {
		open = $bindable(false),
		joinUrl = 'https://randyhereman.com/building',
		captureOnly = false,
		intent,
		onCaptured
	}: Props = $props();

	let email = $state('');
	let submitted = $state(false);
	let error = $state('');

	let dialogEl = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialogEl) return;
		if (open && !dialogEl.open) dialogEl.showModal();
		else if (!open && dialogEl.open) dialogEl.close();
	});

	function resetForm() {
		email = '';
		submitted = false;
		error = '';
	}

	function close() {
		open = false;
		resetForm();
	}

	function onDialogClose() {
		open = false;
		resetForm();
	}

	function validate(value: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
	}

	function onSubmit(event: Event) {
		event.preventDefault();
		error = '';
		const trimmed = email.trim();
		if (!validate(trimmed)) {
			error = 'Pop in a real email so we know where to reach you.';
			return;
		}
		onCaptured?.(trimmed);
		submitted = true;
	}

	function finishJoin() {
		if (captureOnly) {
			close();
			return;
		}
		const url = new URL(joinUrl);
		url.searchParams.set('email', email.trim());
		window.location.href = url.toString();
	}

	const intentCopy = $derived.by(() => {
		if (intent === 'host-meetup') {
			return 'Join free first — then we’ll help you publish your meetup slot here.';
		}
		if (intent === 'rsvp') {
			return 'Leave your email to RSVP — free forever, no paywall.';
		}
		return "Join product people who'd rather ship a prototype than write another PRD. AI does the heavy lifting — you steer.";
	});
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- external community signup -->
<dialog
	bind:this={dialogEl}
	class="join-modal"
	onclose={onDialogClose}
	aria-labelledby="join-modal-title"
>
	<div class="join-modal__panel">
		<div
			class="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-soft blur-3xl"
			aria-hidden="true"
		></div>

		<button type="button" class="join-modal__close" onclick={close} aria-label="Close">
			<IconX class="size-5" aria-hidden="true" />
		</button>

		{#if submitted}
			<div class="relative text-center">
				<Badge variant="accent" dot class="shadow-card">You're in</Badge>
				<h2 id="join-modal-title" class="mt-6 text-3xl font-black tracking-tight text-balance">
					{#if captureOnly}
						Thanks — we saved your email.
					{:else}
						Almost there — one tap left.
					{/if}
				</h2>
				<p class="mt-4 text-lg text-pretty text-ink-soft">
					{#if captureOnly}
						You're on the list. We'll reach out about next steps — free forever, no paywall.
					{:else}
						We'll take you to finish joining the club. Free forever — no paywall to belong.
					{/if}
				</p>
				{#if captureOnly}
					<Button variant="primary" size="lg" class="mt-8 w-full" onclick={finishJoin}>Done</Button>
				{:else}
					<Button variant="primary" size="lg" class="mt-8 w-full" onclick={finishJoin}>
						Finish joining
						{#snippet trailing()}
							<IconArrowRight class="size-5" aria-hidden="true" />
						{/snippet}
					</Button>
				{/if}
			</div>
		{:else}
			<div class="relative text-center">
				<Badge variant="solid" size="lg" dot pulse class="shadow-card">
					A free community for builders
				</Badge>
				<h2
					id="join-modal-title"
					class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl"
				>
					Come build with us.
				</h2>
				<p class="mt-4 text-lg text-pretty text-ink-soft">
					{intentCopy}
				</p>
			</div>

			<form class="relative mt-8 space-y-3" onsubmit={onSubmit}>
				<label class="sr-only" for="join-email">Email address</label>
				<input
					id="join-email"
					type="email"
					name="email"
					autocomplete="email"
					required
					placeholder="you@company.com"
					bind:value={email}
					class="join-modal__input"
				/>
				{#if error}
					<p class="text-sm font-medium text-accent-strong" role="alert">{error}</p>
				{/if}
				<Button type="submit" variant="primary" size="lg" class="w-full">
					Join the club — free
					{#snippet trailing()}
						<IconArrowRight class="size-5" aria-hidden="true" />
					{/snippet}
				</Button>
				<p class="text-center text-sm text-muted">Free forever. No spam — just the good stuff.</p>
			</form>
		{/if}
	</div>
</dialog>

<style>
	.join-modal {
		margin: auto;
		max-width: 32rem;
		width: calc(100% - 2rem);
		border: none;
		padding: 0;
		background: transparent;
		overflow: visible;
	}

	.join-modal::backdrop {
		background: color-mix(in srgb, var(--color-ink) 55%, transparent);
		backdrop-filter: blur(4px);
	}

	.join-modal__panel {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-card);
		border: 1px solid var(--color-accent-soft);
		background: var(--color-surface);
		padding: 2rem 1.75rem;
		box-shadow: var(--shadow-card-lifted);
	}

	@media (min-width: 640px) {
		.join-modal__panel {
			padding: 2.5rem 2.25rem;
		}
	}

	.join-modal__close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 9999px;
		color: var(--color-ink-soft);
		transition:
			background-color 150ms,
			color 150ms;
	}

	.join-modal__close:hover {
		background: var(--color-accent-soft);
		color: var(--color-accent-strong);
	}

	.join-modal__close:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.join-modal__input {
		display: block;
		width: 100%;
		border-radius: 9999px;
		border: 1px solid var(--color-border-strong);
		background: var(--color-surface);
		padding: 0.875rem 1.25rem;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-ink);
		transition:
			border-color 150ms,
			box-shadow 150ms;
	}

	.join-modal__input::placeholder {
		color: var(--color-muted);
	}

	.join-modal__input:focus {
		outline: none;
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px var(--color-accent-soft);
	}
</style>
