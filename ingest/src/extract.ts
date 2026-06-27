import type { IngestConfig } from './config.js';
import { openRouterHeaders } from './config.js';
import { capGlossaryTouches } from './glossary-review.js';
import type { ExtractionDraft, TranscriptResult } from './types.js';

export const EXTRACTION_PROMPT_VERSION = 'pat7-v3';

const SYSTEM_PROMPT = `You are the FunCode Chain Capture Line extractor (PAT-7, GLO-10, GLO-11, INS-48).

Given a podcast transcript, output JSON only — no markdown fences.

Rules:
- Quotes in "words" MUST be verbatim from the transcript (never fabricate).
- Tag each insight and word with landingSlot from this taxonomy:
  shift-old, shift-new, benefit-build, benefit-playground, benefit-free,
  usecase-onboard, usecase-ladder, usecase-audience, usecase-faq, voice-leaders
- insights: 5–7 durable learnings (hard max 7). Prefer quality over quantity; each must stand alone as something FunCode would teach or apply.
- Prefer insights that reinforce FunCode's shift: PR→PROD gate vs PRs as playground (Play Room).
- If speaker is unclear (no diarization), use speakerHint "unknown" — do not invent attribution.
- glossaryTouches: exactly 0–3 items (hard limit 3). Only terms FunCode might TEACH (GLO), not guest jargon or generic industry words.
  For each touch include adoptReason (why FunCode would own this term) and recommendedDisposition:
  "drop" (default — guest/generic), "ins" (guest framework worth an insight, not GLO), "glo" (rare — strong FunCode fit).
  Exclude: dogfooding, growth mindset, latent demand, and org-internal artifacts unless redefined for FunCode.

Output schema:
{
  "episode": { "title": string, "guest": string, "summary": string },
  "insights": [{ "title": string, "description": string, "landingSlot": string, "sourceExcerpt": string }],
  "words": [{ "label": string, "quote": string, "landingSlot": string, "speakerHint": string }],
  "glossaryTouches": [{
    "term": string,
    "adoptReason": string,
    "recommendedDisposition": "drop" | "ins" | "glo",
    "dispositionRationale": string
  }]
}`;

type ChatResponse = {
	choices?: Array<{ message?: { content?: string } }>;
	error?: { message?: string };
	usage?: { cost?: number };
};

function parseLlmJson(raw: string): Omit<ExtractionDraft, 'promptVersion'> {
	const trimmed = raw.trim();
	const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
	const jsonText = fenced?.[1]?.trim() ?? trimmed;
	return JSON.parse(jsonText) as Omit<ExtractionDraft, 'promptVersion'>;
}

export async function extractChainDraft(
	cfg: IngestConfig,
	transcript: TranscriptResult,
	sourceUrl: string,
	videoTitle?: string
): Promise<{ draft: ExtractionDraft; cost: number }> {
	const userContent = [
		`Source URL: ${sourceUrl}`,
		videoTitle ? `Video title: ${videoTitle}` : '',
		`Transcript (${transcript.model}):\n\n${transcript.fullText.slice(0, 120_000)}`
	]
		.filter(Boolean)
		.join('\n\n');

	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: openRouterHeaders(cfg),
		body: JSON.stringify({
			model: cfg.extractModel,
			messages: [
				{ role: 'system', content: SYSTEM_PROMPT },
				{ role: 'user', content: userContent }
			],
			response_format: { type: 'json_object' },
			temperature: 0.2
		})
	});

	const body = (await res.json()) as ChatResponse;
	if (!res.ok) {
		throw new Error(
			`OpenRouter extract failed (${res.status}): ${body.error?.message ?? JSON.stringify(body)}`
		);
	}

	const raw = body.choices?.[0]?.message?.content;
	if (!raw) throw new Error('OpenRouter extract returned empty content');

	const parsed = parseLlmJson(raw);
	const draft: ExtractionDraft = {
		promptVersion: EXTRACTION_PROMPT_VERSION,
		...parsed,
		glossaryTouches: capGlossaryTouches(parsed.glossaryTouches ?? [])
	};

	return { draft, cost: body.usage?.cost ?? 0 };
}
