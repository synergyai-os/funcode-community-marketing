<script lang="ts">
	import { onMount } from 'svelte';
	import { ChapterHeader, StickyYearNav } from '$lib/components/ui';
	import TimelineSpine from '$lib/components/timeline/TimelineSpine.svelte';
	import {
		eventsByYear,
		sortedChapterYears,
		verticalSliceEvents,
		type SliceTopic
	} from '$lib/data/timeline/slice';
	import { timelineGenerated } from '$lib/data/timeline';

	const events = $derived(verticalSliceEvents());
	const chapters = $derived(eventsByYear(events));
	const years = $derived(sortedChapterYears(events));

	let activeYear = $state<number>(new Date().getFullYear());
	let scrollingTo = $state<number | null>(null);

	const countsByYear = $derived.by(() => {
		const counts: Record<number, number> = {};
		for (const [year, list] of chapters) counts[year] = list.length;
		return counts;
	});

	const sliceSubtitle = $derived(
		['agents', 'orchestration']
			.map((t) => timelineGenerated.topicLabels[t as SliceTopic] ?? t)
			.join(' · ')
	);

	function scrollToYear(year: number) {
		const el = document.getElementById(`chapter-${year}`);
		if (!el) return;
		scrollingTo = year;
		activeYear = year;
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		window.setTimeout(() => {
			scrollingTo = null;
		}, 800);
	}

	onMount(() => {
		const sections = years.map((y) => document.getElementById(`chapter-${y}`)).filter(Boolean);
		if (sections.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (scrollingTo != null) return;
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				const top = visible[0];
				if (!top?.target.id.startsWith('chapter-')) return;
				const year = Number(top.target.id.replace('chapter-', ''));
				if (!Number.isNaN(year)) activeYear = year;
			},
			{ rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
		);

		for (const section of sections) observer.observe(section!);

		// Default scroll to latest year (DEC-40).
		const latest = years[years.length - 1];
		if (latest != null) {
			requestAnimationFrame(() => scrollToYear(latest));
		}

		return () => observer.disconnect();
	});

	$effect(() => {
		if (years.length && !years.includes(activeYear)) {
			activeYear = years[years.length - 1]!;
		}
	});
</script>

{#if years.length === 0}
	<p class="py-16 text-center text-ink-soft">No events in this slice yet — ingest more sources.</p>
{:else}
	<StickyYearNav {years} {activeYear} {countsByYear} onSelectYear={scrollToYear} />

	<div class="mt-6 space-y-4">
		{#each years as year (year)}
			<section id="chapter-{year}" class="scroll-mt-24">
				<ChapterHeader
					{year}
					eventCount={chapters.get(year)?.length ?? 0}
					subtitle={sliceSubtitle}
				/>
				<TimelineSpine events={chapters.get(year) ?? []} />
			</section>
		{/each}
	</div>
{/if}
