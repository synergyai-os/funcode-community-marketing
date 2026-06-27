export type JobStatus =
	| 'pending'
	| 'downloading'
	| 'transcribing'
	| 'extracting'
	| 'draft_ready'
	| 'committed'
	| 'failed';

export type JobMeta = {
	videoId: string;
	sourceUrl: string;
	title?: string;
	status: JobStatus;
	createdAt: string;
	updatedAt: string;
	error?: string;
	sttModel?: string;
	extractModel?: string;
	audioDurationSec?: number;
	transcriptCostUsd?: number;
	extractCostUsd?: number;
};

export type TranscriptSegment = {
	index: number;
	startSec: number;
	endSec: number;
	text: string;
};

export type TranscriptResult = {
	fullText: string;
	segments: TranscriptSegment[];
	provider: 'openrouter-whisper';
	model: string;
	language?: string;
};

export type WordCandidate = {
	label: string;
	quote: string;
	landingSlot: string;
	speakerHint?: string;
};

export type InsightCandidate = {
	title: string;
	description: string;
	landingSlot: string;
	sourceExcerpt: string;
};

export type GlossaryDisposition = 'drop' | 'ins' | 'glo';

export type GlossaryTouchCandidate = {
	term: string;
	adoptReason: string;
	recommendedDisposition: GlossaryDisposition;
	dispositionRationale: string;
};

export type ExtractionDraft = {
	promptVersion: string;
	episode: {
		title: string;
		guest: string;
		summary: string;
	};
	insights: InsightCandidate[];
	words: WordCandidate[];
	/** pat7-v1: string[]; pat7-v2: GlossaryTouchCandidate[] */
	glossaryTouches: string[] | GlossaryTouchCandidate[];
};

export interface TranscriptionProvider {
	name: string;
	transcribe(audioPath: string): Promise<TranscriptResult>;
}
