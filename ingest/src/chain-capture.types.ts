/** Written after PAT-7 stage 5 pb capture — feeds episode brief (PAT-9). */
export type ChainCaptureManifest = {
	capturedAt: string;
	sourceUrl: string;
	videoId: string;
	episodeIns: string;
	guestLand?: string;
	showLand?: string;
	insights: Array<{ id: string; title: string }>;
	words: Array<{ id: string; label: string }>;
	glossaryIns?: string;
};
