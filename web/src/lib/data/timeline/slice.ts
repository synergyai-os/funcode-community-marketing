import { timelineGenerated } from './generated';
import type { TimelineEvent } from './types';

/** WP-3 vertical slice — Agents & Orchestration (years span ingest data). */
export const SLICE_TOPICS = ['agents', 'orchestration'] as const;
export const SLICE_YEARS = [2024, 2025, 2026] as const;

export type SliceTopic = (typeof SLICE_TOPICS)[number];

export function isSliceEvent(event: TimelineEvent): boolean {
	if (event.kind === 'episode') return false;
	if (event.year == null) return false;
	if (!(SLICE_YEARS as readonly number[]).includes(event.year)) return false;
	if (!event.topic) return false;
	return (SLICE_TOPICS as readonly string[]).includes(event.topic);
}

export function verticalSliceEvents(): TimelineEvent[] {
	const list: TimelineEvent[] = [];
	for (const event of timelineGenerated.events) {
		if (isSliceEvent(event)) list.push(event);
	}
	return list.sort((a, b) => {
		const ta = a.sourcePublishedAt ?? a.ingestedAt ?? '';
		const tb = b.sourcePublishedAt ?? b.ingestedAt ?? '';
		return tb.localeCompare(ta);
	});
}

export function eventsByYear(events: TimelineEvent[]): Map<number, TimelineEvent[]> {
	const map = new Map<number, TimelineEvent[]>();
	for (const e of events) {
		if (e.year == null) continue;
		const list = map.get(e.year) ?? [];
		list.push(e);
		map.set(e.year, list);
	}
	return map;
}

export function sortedChapterYears(events: TimelineEvent[]): number[] {
	return [...eventsByYear(events).keys()].sort((a, b) => a - b);
}
