export type ClaimKind = 'belief' | 'prediction' | 'observation';

export type PredictionStatus = 'open' | 'partial' | 'true' | 'false' | 'superseded' | 'untrackable';

export type TimelineEventKind = 'episode' | 'belief' | 'prediction' | 'insight' | 'word';

export type TimelineEvent = {
	id: string;
	kind: TimelineEventKind;
	title: string;
	speaker: string;
	platformSlug: string;
	platformName: string;
	sourceUrl: string;
	/** Original source publication (ISO). */
	sourcePublishedAt: string | null;
	/** When FunCode ingested (ISO). */
	ingestedAt: string | null;
	year: number | null;
	claimKind?: ClaimKind;
	predictionStatus?: PredictionStatus;
	predictionHorizon?: string;
	resolvedAt?: string | null;
	resolutionNotes?: string;
	topic?: string;
	landingSlot?: string;
	excerpt?: string;
	chainId?: string;
	personaIds: string[];
};

export type SpeakerRecord = {
	name: string;
	beliefs: number;
	predictions: number;
	open: number;
	resolvedTrue: number;
	resolvedPartial: number;
};

export type ConvergenceRow = {
	topic: string;
	label: string;
	speakers: string[];
	eventCount: number;
	alignment: 'converging' | 'mixed';
	latestYear: number;
};

export type TimelineManifest = {
	generatedAt: string;
	events: TimelineEvent[];
	years: number[];
	beliefsByYear: Record<string, string[]>;
	predictionsByYear: Record<string, string[]>;
	speakers: SpeakerRecord[];
	convergence: ConvergenceRow[];
	topicLabels: Record<string, string>;
	stats: {
		eventCount: number;
		predictionCount: number;
		beliefCount: number;
		openPredictions: number;
		resolvedTrue: number;
		yearSpan: { min: number; max: number } | null;
	};
};
