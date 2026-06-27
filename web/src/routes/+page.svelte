<script lang="ts">
	import type { Component } from 'svelte';
	import {
		Accordion,
		AudienceChip,
		AudienceCluster,
		Badge,
		Button,
		Card,
		JoinClubModal,
		TestimonialDeck
	} from '$lib/components/ui';
	import VoicesSection from '$lib/components/landing/VoicesSection.svelte';
	import { heroAudienceChips } from '$lib/data/personas';
	import { testimonials, published } from '$lib/data/testimonials';
	import IconArrowRight from '~icons/lucide/arrow-right';
	import IconPause from '~icons/lucide/pause';
	import IconPlay from '~icons/lucide/play';
	import IconSparkles from '~icons/lucide/sparkles';
	import IconLayoutGrid from '~icons/lucide/layout-grid';
	import IconGift from '~icons/lucide/gift';
	import IconFileText from '~icons/lucide/file-text';
	import IconBlocks from '~icons/lucide/blocks';
	import IconGitFork from '~icons/lucide/git-fork';
	import IconCompass from '~icons/lucide/compass';
	import IconRocket from '~icons/lucide/rocket';
	import IconEye from '~icons/lucide/eye';
	import IconBookOpen from '~icons/lucide/book-open';
	import IconFlaskConical from '~icons/lucide/flask-conical';
	import IconMessagesSquare from '~icons/lucide/messages-square';
	import IconLightbulb from '~icons/lucide/lightbulb';
	import IconWrench from '~icons/lucide/wrench';

	// Production ships only consented quotes (TEN-5/BR-3) → honest fallback when none.
	// In dev we preview the deck with placeholders so the interaction is testable;
	// `import.meta.env.DEV` is compiled out of the production bundle, so they never ship.
	const stories = import.meta.env.DEV ? testimonials : published(testimonials);

	const JOIN_URL = 'https://randyhereman.com/building';
	const PRODUCT_BRAIN_URL = 'https://productbrain.io';

	type Feature = { title: string; body: string; icon: Component; id?: string };

	// The three value cards. Play Room copy resolves TEN-4 (the approved
	// playful-yet-humble exemplar from DEC-12 / STD-4).
	const features: Feature[] = [
		{
			title: 'Build with AI',
			body: 'Ship real things with AI instead of writing docs about them. You say what you want, the agent does the heavy lifting, and you steer it to something that works.',
			icon: IconSparkles
		},
		{
			title: 'Your playground',
			body: "Treat the codebase like a shared sandbox. A PR is just where you try things out loud — the good stuff ships, the rest gets deleted or handed off. That's not failing. That's how you learn what the product can really do.",
			icon: IconLayoutGrid,
			id: 'playroom'
		},
		{
			title: "It's all free",
			body: 'Watch, read, try things, break things, help someone out. Take what you need, give what you can. The learning never costs anything.',
			icon: IconGift
		}
	];

	// INS-18 — the mental-model switch we teach, named enemy STR-2.
	type Shift = { eyebrow: string; title: string; body: string; icon: Component };
	const oldWay: Shift = {
		eyebrow: 'The old way',
		title: 'PR → PROD',
		body: 'A pull request is a gate. Review is a verdict. So you over-prepare, hesitate, and ship slow — if you ship at all.',
		icon: IconFileText
	};
	const funCodeWay: Shift = {
		eyebrow: 'The FunCode way',
		title: 'PRs as a playground',
		body: 'The codebase is a shared sandbox. You build in the open, the good stuff ships, and the rest gets deleted or handed off. No shame.',
		icon: IconBlocks
	};

	// FLO-1 — from join to first shipped Play Room, in minutes.
	type Step = { n: string; title: string; body: string; icon: Component };
	const steps: Step[] = [
		{
			n: '01',
			title: 'Fork the starter',
			body: 'Grab the FunCode template repo. It comes wired with everything — rules, governance, the lot.',
			icon: IconGitFork
		},
		{
			n: '02',
			title: 'Orient your agent',
			body: 'Run pb orient so your agent knows the plan and your past decisions before it writes a line.',
			icon: IconCompass
		},
		{
			n: '03',
			title: 'Open a Play Room',
			body: 'Ship your first prototype out loud. Keep what works, bin the rest. That is the whole game.',
			icon: IconRocket
		}
	];

	// GLO-9 — every rung is free; you choose how far you climb.
	type Rung = { label: string; icon: Component };
	const ladder: Rung[] = [
		{ label: 'Watch', icon: IconEye },
		{ label: 'Read & study', icon: IconBookOpen },
		{ label: 'Try things', icon: IconFlaskConical },
		{ label: 'Join the discussion', icon: IconMessagesSquare },
		{ label: 'Start your own', icon: IconLightbulb },
		{ label: 'Build with our tools', icon: IconWrench }
	];

	// AUD-1 — shared persona registry (hero, voices, /for/* pages).
	const audience = heroAudienceChips();

	// The hero audience cluster floats on its own; this toggle gives people a way to
	// freeze that motion (WCAG 2.2.2). Lives lower in the hero, near the CTAs.
	let audiencePaused = $state(false);
	let joinModalOpen = $state(false);

	function openJoinModal() {
		joinModalOpen = true;
	}

	// STR-7 / STR-8 / STR-9 — free is the heart; everything else is optional.
	type Way = {
		eyebrow: string;
		title: string;
		body: string;
		cta: string;
		href: string;
		icon: Component;
	};
	const optionalWays: Way[] = [
		{
			eyebrow: 'Optional · live beta',
			title: 'Try Product Brain',
			body: 'An optional governance layer for agent memory — orient, capture, contradiction checks. We use it to run FunCode itself. Never required to belong.',
			cta: 'Try Product Brain',
			href: PRODUCT_BRAIN_URL,
			icon: IconSparkles
		},
		{
			eyebrow: 'Optional',
			title: 'Build sprints & cohorts',
			body: "Want a hand getting going, solo or with a few teammates? We run the occasional build-sprint and cohort. Totally optional — come if it helps, skip it if it doesn't.",
			cta: 'Join — free',
			href: JOIN_URL,
			icon: IconRocket
		}
	];

	type Faq = { q: string; a: string };
	const faqs: Faq[] = [
		{
			q: 'Is it really free?',
			a: 'Yes. The community, the knowledge, and the learning are free at every level — forever. We make money from optional paid tools and services, never from access to the community.'
		},
		{
			q: 'Do I need Product Brain to join?',
			a: 'No. Product Brain is an optional governance layer we happen to love and use ourselves. You belong, learn, and build without it.'
		},
		{
			q: "What's a Play Room?",
			a: 'Our reframe of pull requests. Instead of PR → PROD as a gate you pass, the codebase is a shared sandbox you build in. The good stuff ships, the rest gets deleted or handed off.'
		},
		{
			q: 'Which tools or frameworks do I need?',
			a: "Whatever you like. FunCode is product- and framework-agnostic — it's about building good products with AI, not selling you a stack."
		},
		{
			q: 'What do I need to get started?',
			a: 'Fork the starter repo, run pb orient, and open your first Play Room. Minutes, not a planning cycle.'
		},
		{
			q: 'Do I need to be technical?',
			a: 'No. If you can describe what you want clearly, the agent does the heavy lifting. Everyone can create.'
		}
	];

	const shiftSides: Shift[] = [oldWay, funCodeWay];
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>FunCode — Everyone can create</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<a
		href="#main"
		class="sr-only rounded-card bg-ink px-4 py-2 font-semibold text-white focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
	>
		Skip to main content
	</a>
	<header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- marketing root link -->
		<a href="/" class="flex items-center gap-2 font-extrabold tracking-tight">
			<span class="grid h-8 w-8 place-items-center rounded-lg bg-ink text-white">&lt;/&gt;</span>
			<span>FunCode</span>
		</a>
		<nav class="hidden items-center gap-8 text-sm font-medium text-ink-soft sm:flex">
			<a class="transition hover:text-ink" href="#how">How it works</a>
			<a class="transition hover:text-ink" href="#playroom">Playground</a>
			<a class="transition hover:text-ink" href="#free">Free</a>
			<a class="transition hover:text-ink" href="#faq">FAQ</a>
		</nav>
		<Button href={JOIN_URL} variant="primary" size="sm">Join — free</Button>
	</header>

	<main id="main">
		<!-- Hero -->
		<section class="relative overflow-hidden">
			<div
				class="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent-soft blur-3xl"
			></div>

			<div class="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-20 text-center sm:pt-24">
				<Badge variant="solid" size="lg" dot pulse class="shadow-card">
					A free community for builders
				</Badge>

				<!-- Headline stage (AUD-1): on wide screens (xl+, the width the scatter is
				     art-directed for) the audience weaves THROUGH the headline — some chips
				     in front of the text, some tucked behind it (the H1 is pointer-events-none
				     so behind chips stay grabbable). The H1 sits at z-10; the scatter layers
				     around it (front 20 / behind 0). Below xl the scatter would crowd the
				     headline against the viewport edges, so we fall back to rows there. -->
				<div class="relative mt-8">
					<h1
						class="pointer-events-none relative z-10 text-5xl font-black tracking-tight text-balance sm:text-7xl"
					>
						Everyone can create.
						<span class="block text-accent">Learn how to build with AI.</span>
					</h1>

					<AudienceCluster
						variant="scatter"
						items={audience}
						bind:paused={audiencePaused}
						playfulness={0.7}
						onJoin={openJoinModal}
						class="hidden xl:block"
					/>
				</div>

				<!-- Phones, tablets & narrow laptops meet the same crowd as a tidy, draggable
				     two-row cluster (overlapping the big headline there would hurt legibility
				     and the scatter needs xl room to breathe). -->
				<AudienceCluster
					variant="rows"
					items={audience}
					bind:paused={audiencePaused}
					onJoin={openJoinModal}
					class="mt-10 xl:hidden"
				/>

				<p class="mx-auto mt-10 max-w-2xl text-lg text-pretty text-ink-soft sm:text-xl">
					Join product people who'd rather ship a prototype than write another PRD — building in
					Play Rooms, not permission gates. AI does the heavy lifting; you steer.
				</p>

				<div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Button href={JOIN_URL} variant="primary" size="lg" class="w-full sm:w-auto">
						Join — free
						{#snippet trailing()}
							<IconArrowRight class="size-5" aria-hidden="true" />
						{/snippet}
					</Button>
					<Button href="#how" variant="secondary" size="lg" class="w-full sm:w-auto">
						How it works
					</Button>
				</div>

				<p class="mt-5 text-sm text-muted">Free forever. No paywall to belong, learn, or build.</p>
			</div>

			<!-- Pause/resume for the cluster's ambient float (WCAG 2.2.2). Kept here, low
			     in the hero, so the chips between the headline and pitch stay uncluttered.
			     Hidden when the user already prefers reduced motion (nothing to pause). -->
			<div class="relative z-10 -mt-8 flex justify-center pb-16 motion-reduce:hidden">
				<Button
					variant="secondary"
					size="sm"
					aria-pressed={audiencePaused}
					onclick={() => (audiencePaused = !audiencePaused)}
				>
					{#snippet leading()}
						{#if audiencePaused}
							<IconPlay class="size-4" aria-hidden="true" />
						{:else}
							<IconPause class="size-4" aria-hidden="true" />
						{/if}
					{/snippet}
					{audiencePaused ? 'Resume' : 'Pause'} motion
				</Button>
			</div>
		</section>

		<!-- The shift: PR → PROD becomes PRs as a playground (INS-18, STR-2) -->
		<section id="how" class="border-y border-border bg-surface-muted">
			<div class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
				<div class="mx-auto max-w-2xl text-center">
					<Badge variant="neutral">The shift</Badge>
					<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
						Stop shipping documents. Start shipping prototypes.
					</h2>
					<p class="mt-4 text-lg text-pretty text-ink-soft">
						The skill isn't prompting — it's making your intent clear enough for an agent to act on.
						Here's the mental model we want you to switch.
					</p>
				</div>

				<div class="mt-12 grid gap-6 md:grid-cols-2">
					{#each shiftSides as side, i (side.title)}
						<article
							class={`rounded-card border p-8 ${
								i === 0 ? 'border-border bg-surface' : 'border-accent-soft bg-accent-soft/40'
							}`}
						>
							<div
								class={`grid size-12 place-items-center rounded-card ${
									i === 0 ? 'bg-surface-subtle text-ink-soft' : 'bg-accent-soft text-accent'
								}`}
							>
								{#if i === 0}
									<IconFileText class="size-6" aria-hidden="true" />
								{:else}
									<IconBlocks class="size-6" aria-hidden="true" />
								{/if}
							</div>
							<p class="mt-5 text-xs font-semibold tracking-wide uppercase text-ink-soft">
								{side.eyebrow}
							</p>
							<h3 class="mt-2 text-2xl font-bold">{side.title}</h3>
							<p class="mt-3 text-ink-soft">{side.body}</p>
						</article>
					{/each}
				</div>

				<p class="mx-auto mt-10 max-w-2xl text-center text-xl font-bold text-balance sm:text-2xl">
					A PR isn't a verdict on you. It's a move in a game everyone's playing.
				</p>
			</div>
		</section>

		<!-- Three value cards -->
		<section id="build" class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
			<div class="grid gap-6 sm:grid-cols-3">
				{#each features as feature (feature.title)}
					<Card icon={feature.icon} title={feature.title} id={feature.id}>
						{feature.body}
					</Card>
				{/each}
			</div>
		</section>

		<!-- Start in 3 steps (FLO-1) -->
		<section class="border-y border-border bg-surface-muted">
			<div class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
				<div class="mx-auto max-w-2xl text-center">
					<Badge variant="neutral">Get going</Badge>
					<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
						From zero to your first Play Room
					</h2>
					<p class="mt-4 text-lg text-pretty text-ink-soft">
						It takes minutes, not a planning cycle.
					</p>
				</div>

				<ol class="mt-12 grid gap-6 sm:grid-cols-3">
					{#each steps as step (step.n)}
						<li class="rounded-card border border-border bg-surface p-8">
							<div class="flex items-center justify-between">
								<div
									class="grid size-12 place-items-center rounded-card bg-accent-soft text-accent"
								>
									<step.icon class="size-6" aria-hidden="true" />
								</div>
								<span class="text-2xl font-black text-faint">{step.n}</span>
							</div>
							<h3 class="mt-5 text-xl font-bold">{step.title}</h3>
							<p class="mt-2 text-ink-soft">{step.body}</p>
						</li>
					{/each}
				</ol>
			</div>
		</section>

		<!-- Engagement ladder (GLO-9) -->
		<section id="free" class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
			<div class="mx-auto max-w-2xl text-center">
				<Badge variant="accent" dot>Free forever</Badge>
				<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
					Come in at whatever level you want
				</h2>
				<p class="mt-4 text-lg text-pretty text-ink-soft">
					Every rung is free. You decide how far you climb — want-to, not have-to.
				</p>
			</div>

			<ul class="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
				{#each ladder as rung, i (rung.label)}
					<li
						class="flex items-center gap-4 rounded-card border border-border bg-surface px-5 py-4"
					>
						<span class="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
							<rung.icon class="size-5" aria-hidden="true" />
						</span>
						<span class="font-semibold">{rung.label}</span>
						<span class="ml-auto text-sm font-medium text-muted">
							{String(i + 1).padStart(2, '0')}
						</span>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Who it's for (AUD-1, INS-11) -->
		<section class="border-y border-border bg-surface-muted">
			<div class="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
				<Badge variant="neutral">Who it's for</Badge>
				<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
					Built for product people who'd rather build
				</h2>
				<p class="mt-4 text-lg text-pretty text-ink-soft">
					If you'd rather ship a prototype than polish a slide deck, you're one of us. Any tool, any
					framework — bring what you like.
				</p>

				<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
					{#each audience as who, i (who.label)}
						{#if who.you}
							<AudienceChip
								emoji={who.emoji}
								index={i}
								variant="accent"
								cta={true}
								onJoin={openJoinModal}
							>
								{who.label}
							</AudienceChip>
						{:else if who.personaId}
							<a
								href="/for/{who.personaId}"
								class="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
							>
								<AudienceChip emoji={who.emoji} index={i} variant="neutral">
									{who.label}
								</AudienceChip>
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</section>

		<VoicesSection />

		<!--
			Play Room stories. The swipeable deck (DEC-22) renders only consented quotes
			(TEN-5); with none yet, we show an honest "stories soon" card (BR-3 — no
			fabricated names). One consented quote flips this to the deck automatically.
		-->
		<section id="builders" class="py-20 sm:py-24">
			{#if stories.length > 0}
				<div class="mx-auto max-w-2xl px-6 text-center">
					<Badge variant="neutral">In the open</Badge>
					<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
						Builders are already shipping
					</h2>
					<p class="mt-4 text-lg text-pretty text-ink-soft">
						Real people building in Play Rooms instead of waiting for permission. Swipe through.
					</p>
				</div>

				<div class="mt-12">
					<TestimonialDeck items={stories} />
				</div>
			{:else}
				<div class="mx-auto max-w-2xl px-6 text-center">
					<Badge variant="neutral">In the open</Badge>
					<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
						Play Room stories, soon
					</h2>
					<p class="mt-4 text-lg text-pretty text-ink-soft">
						We're collecting real builder stories — with consent — from people shipping in Play
						Rooms. No fake quotes here.
					</p>
				</div>

				<div class="mx-auto mt-12 max-w-xl px-6">
					<Card title="Your story could be first">
						Open a Play Room, ship something small, and tell us what changed. We'll ask before we
						publish anything with your name on it. Until then, poke at the repo — that's the
						curriculum.
					</Card>
				</div>
			{/if}
		</section>

		<!-- Ways to go further (STR-7 dominant, STR-8/STR-9 optional) -->
		<section id="ways" class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
			<div class="mx-auto max-w-2xl text-center">
				<Badge variant="neutral">Ways to go further</Badge>
				<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
					The community is the heart — and it's free
				</h2>
				<p class="mt-4 text-lg text-pretty text-ink-soft">Everything else is optional.</p>
			</div>

			<div
				class="mt-12 flex flex-col items-start justify-between gap-6 rounded-card border border-accent-soft bg-accent-soft/40 p-8 sm:flex-row sm:items-center sm:p-10"
			>
				<div>
					<Badge variant="accent" dot>Free forever</Badge>
					<h3 class="mt-4 text-2xl font-bold">Join the community</h3>
					<p class="mt-2 max-w-xl text-ink-soft">
						Watch, read, discuss, and build alongside product people. No paywall to belong, learn,
						or participate.
					</p>
				</div>
				<Button href={JOIN_URL} variant="primary" size="lg" class="w-full shrink-0 sm:w-auto">
					Join the community — free
				</Button>
			</div>

			<div class="mt-6 grid gap-6 md:grid-cols-2">
				{#each optionalWays as way (way.title)}
					<article class="flex flex-col rounded-card border border-border bg-surface p-8">
						<div
							class="grid size-12 place-items-center rounded-card bg-surface-subtle text-ink-soft"
						>
							<way.icon class="size-6" aria-hidden="true" />
						</div>
						<p class="mt-5 text-xs font-semibold tracking-wide uppercase text-muted">
							{way.eyebrow}
						</p>
						<h3 class="mt-2 text-xl font-bold">{way.title}</h3>
						<p class="mt-2 grow text-ink-soft">{way.body}</p>
						<div class="mt-6">
							<Button href={way.href} variant="secondary" size="md">{way.cta}</Button>
						</div>
					</article>
				{/each}
			</div>

			<p class="mt-8 text-center text-sm text-muted">
				Optional tools and services — never a gate to the community.
			</p>
		</section>

		<!-- FAQ -->
		<section id="faq" class="border-y border-border bg-surface-muted">
			<div class="mx-auto max-w-3xl px-6 py-20 sm:py-24">
				<div class="text-center">
					<Badge variant="neutral">FAQ</Badge>
					<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
						Questions? We've got answers.
					</h2>
				</div>

				<div class="mt-10 border-t border-border">
					{#each faqs as faq (faq.q)}
						<Accordion question={faq.q}>{faq.a}</Accordion>
					{/each}
				</div>
			</div>
		</section>

		<!-- Final CTA -->
		<section id="join" class="mx-auto max-w-6xl px-6 py-20 sm:py-28">
			<div
				class="relative overflow-hidden rounded-card bg-ink px-8 py-16 text-center text-white sm:px-16"
			>
				<div
					class="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
				></div>
				<h2 class="relative text-3xl font-black tracking-tight text-balance sm:text-5xl">
					Come build with us.
				</h2>
				<p class="relative mx-auto mt-4 max-w-xl text-on-dark-muted">
					We're not here to sell you a stack — we're here to help you build good products with AI:
					for yourself, your team, or your organisation.
				</p>
				<Button href={JOIN_URL} variant="primary" size="lg" class="mt-8">Join — free</Button>
			</div>
		</section>
	</main>

	<footer class="border-t border-border">
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-muted sm:flex-row"
		>
			<p>© {year} FunCode. Everyone can create.</p>
			<p>Built with SvelteKit + Tailwind.</p>
		</div>
	</footer>
</div>

<JoinClubModal bind:open={joinModalOpen} joinUrl={JOIN_URL} />
