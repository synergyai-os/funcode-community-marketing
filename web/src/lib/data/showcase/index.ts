export type {
	ShowcaseBatch,
	ShowcaseEpisode,
	ShowcaseInsight,
	ShowcaseWord,
	MentalModelSection
} from './types.js';
export { lennyBatch, lennyBatchChainIds, LENNY_BATCH_VIDEO_IDS } from './lenny-batch.generated.js';

/** Slice insights for a mental-model theme by guest-agnostic keyword hints. */
export function insightsForSection(
	batch: import('./types.js').ShowcaseBatch,
	sectionId: string,
	limit = 3
): { old: import('./types.js').ShowcaseInsight[]; neu: import('./types.js').ShowcaseInsight[] } {
	const hints: Record<string, { old: RegExp[]; neu: RegExp[] }> = {
		product: {
			old: [/customer|feedback|roadmap|PM|product management|design process/i],
			neu: [/PM|CEO|roadmap|design should control|agentic|bigger bets|incremental/i]
		},
		building: {
			old: [/code|review|design process|bottleneck/i],
			neu: [/agent|code|dark factory|TDD|pattern|inflection|cheap/i]
		},
		team: {
			old: [/feedback|hierarchical|senior|customer/i],
			neu: [/barrel|flat|talent|first-day|specializ|engineer-PM|undiscovered/i]
		},
		growth: {
			old: [/product-market|PMF|customer|incremental/i],
			neu: [/distribution|growth|friction|bet|hypergrowth|automate/i]
		},
		trust: {
			old: [/feedback|lethal|unsafe/i],
			neu: [/trust|agent|OpenClaw|specializ|ramble|pull the thread|lethal/i]
		}
	};
	const h = hints[sectionId] ?? { old: [/.*/], neu: [/.*/] };
	const match = (ins: import('./types.js').ShowcaseInsight, patterns: RegExp[]) =>
		patterns.some((p) => p.test(ins.title) || p.test(ins.description));

	return {
		old: batch.shiftOld.filter((i) => match(i, h.old)).slice(0, limit),
		neu: batch.shiftNew.filter((i) => match(i, h.neu)).slice(0, limit)
	};
}
