import { guestAuthority } from './voice-guests.js';
import type { PersonaId } from './personas.js';
import { PERSONA_IDS } from './personas.js';

/**
 * Thought-leader voice cards (GLO-11 WORDS) — grouped by persona for landing + `/for/*`.
 *
 * Governance: distinct from member testimonials (TEN-5 consent). Public podcast
 * quotes + sourceRef — ship when `published: true` (Randy ratifies after QUE-5).
 *
 * Authority lines: `voice-guests.ts` (Chain LAND). Ingest sync: `ingest sync-voices`.
 */
/** Humble podcast attribution (STD-6) — linked in card header, not under the name. */
export const VOICE_SOURCE_LABEL = "On Lenny's Podcast";

export type Voice = {
	id: string;
	quote: string;
	name: string;
	/** Authority under the name — from guestAuthority() / voice-guests.ts (STD-6). */
	role: string;
	sourceLabel: string;
	personaIds: PersonaId[];
	chainId: string;
	sourceRef: string;
	/** Randy ratifies after QUE-5 — only published cards ship in prod. */
	published: boolean;
	/** Content + attribution reviewed; flip published when QUE-5 closes. */
	staged: boolean;
};

export const voices: Voice[] = [
	{
		id: 'fiona-make-new-mistakes',
		quote: "It's okay to make mistakes — just make new ones so we're always learning.",
		name: 'Fiona Fung',
		role: guestAuthority('Fiona Fung'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-44',
		sourceRef: 'https://www.youtube.com/watch?v=Ybrl4FYM57c',
		published: true,
		staged: true
	},
	{
		id: 'fiona-everything-possible',
		quote: "Everything is now possible in theory. Now it's about how ambitious can you be?",
		name: 'Fiona Fung',
		role: guestAuthority('Fiona Fung'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-45',
		sourceRef: 'https://www.youtube.com/watch?v=Ybrl4FYM57c',
		published: true,
		staged: true
	},
	{
		id: 'fiona-freedom-to-cook',
		quote:
			'Give people the freedom to cook — room to experiment instead of following a rigid recipe.',
		name: 'Fiona Fung',
		role: guestAuthority('Fiona Fung'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['designers-who-build', 'product-managers'],
		chainId: 'INS-42',
		sourceRef: 'https://www.youtube.com/watch?v=Ybrl4FYM57c',
		published: true,
		staged: true
	},
	{
		id: 'fiona-trust-verify',
		quote:
			'Trust but verify — let agents run, then check the work like you would a junior teammate.',
		name: 'Fiona Fung',
		role: guestAuthority('Fiona Fung'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['agent-curious-engineers', 'product-managers'],
		chainId: 'INS-43',
		sourceRef: 'https://www.youtube.com/watch?v=Ybrl4FYM57c',
		published: true,
		staged: true
	},
	{
		id: 'fiona-lean-into-fear',
		quote:
			'For anything there is a fear, lean in and ask: what can I do about it? What is within my control?',
		name: 'Fiona Fung',
		role: guestAuthority('Fiona Fung'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'teams-going-faster'],
		chainId: 'INS-46',
		sourceRef: 'https://www.youtube.com/watch?v=Ybrl4FYM57c',
		published: true,
		staged: true
	},
	{
		id: 'mark-internet-treasures',
		quote: "I want to create an internet treasure — a service we can't remember life before.",
		name: 'Mark Pincus',
		role: guestAuthority('Mark Pincus'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders'],
		chainId: 'INS-59',
		sourceRef: 'https://www.youtube.com/watch?v=7eh9C3TUotc',
		published: true,
		staged: true
	},
	{
		id: 'mark-define-innovation',
		quote:
			"If you're truly ambitious, burn the resume — define innovation in the eyes of your consumer, not your peers.",
		name: 'Mark Pincus',
		role: guestAuthority('Mark Pincus'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders'],
		chainId: 'INS-56',
		sourceRef: 'https://www.youtube.com/watch?v=7eh9C3TUotc',
		published: true,
		staged: true
	},
	{
		id: 'mark-expert-witness',
		quote:
			'I was a frustrated expert witness when I worked for other people — that energy makes great founders.',
		name: 'Mark Pincus',
		role: guestAuthority('Mark Pincus'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'indie-makers'],
		chainId: 'INS-58',
		sourceRef: 'https://www.youtube.com/watch?v=7eh9C3TUotc',
		published: true,
		staged: true
	},
	{
		id: 'mark-lightning-bottle',
		quote:
			"If you're asking whether your product is an A, it's not an A — when it's real, you feel it.",
		name: 'Mark Pincus',
		role: guestAuthority('Mark Pincus'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-managers'],
		chainId: 'INS-57',
		sourceRef: 'https://www.youtube.com/watch?v=7eh9C3TUotc',
		published: true,
		staged: true
	},
	{
		id: 'mark-moral-arbitrage',
		quote: 'Innovation can start by copying what works — uncomfortable, but strategic.',
		name: 'Mark Pincus',
		role: guestAuthority('Mark Pincus'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders'],
		chainId: 'INS-55',
		sourceRef: 'https://www.youtube.com/watch?v=7eh9C3TUotc',
		published: true,
		staged: true
	},
	{
		id: 'dan-ride-models',
		quote: 'Ride the models — use them for whatever you do and stay on the capability curve.',
		name: 'Dan Shipper',
		role: guestAuthority('Dan Shipper'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['agent-curious-engineers', 'product-managers'],
		chainId: 'INS-64',
		sourceRef: 'https://www.youtube.com/watch?v=4D3hDmGhFhA',
		published: true,
		staged: true
	},
	{
		id: 'dan-forward-deployed',
		quote:
			"Set up a forward-deployed engineer — someone whose job is making the company's agent work for everyone.",
		name: 'Dan Shipper',
		role: guestAuthority('Dan Shipper'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['agent-curious-engineers', 'teams-going-faster'],
		chainId: 'INS-66',
		sourceRef: 'https://www.youtube.com/watch?v=4D3hDmGhFhA',
		published: true,
		staged: true
	},
	{
		id: 'dan-frozen-competence',
		quote:
			"Models commoditize yesterday's human competence — the skill is staying ahead of the curve.",
		name: 'Dan Shipper',
		role: guestAuthority('Dan Shipper'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['agent-curious-engineers', 'product-leaders'],
		chainId: 'INS-68',
		sourceRef: 'https://www.youtube.com/watch?v=4D3hDmGhFhA',
		published: true,
		staged: true
	},
	{
		id: 'dan-spaciousness',
		quote: 'When something is hard, relate to it from strength and spaciousness — not panic.',
		name: 'Dan Shipper',
		role: guestAuthority('Dan Shipper'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['teams-going-faster', 'product-leaders'],
		chainId: 'INS-70',
		sourceRef: 'https://www.youtube.com/watch?v=4D3hDmGhFhA',
		published: true,
		staged: true
	},
	{
		id: 'benedict-radical-uncertainty',
		quote: 'Presume radical uncertainty — then dive in and build intuition for what works.',
		name: 'Benedict Evans',
		role: guestAuthority('Benedict Evans'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-86',
		sourceRef: 'https://www.youtube.com/watch?v=BD3vLtWhT5A',
		published: true,
		staged: true
	},
	{
		id: 'benedict-1997',
		quote:
			"We're in 1997 for AI — exciting, most stuff doesn't work yet, and the big apps aren't built.",
		name: 'Benedict Evans',
		role: guestAuthority('Benedict Evans'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'founders'],
		chainId: 'INS-88',
		sourceRef: 'https://www.youtube.com/watch?v=BD3vLtWhT5A',
		published: true,
		staged: true
	},
	{
		id: 'benedict-it-depends',
		quote: "It depends — the honest answer when the future hasn't been built yet.",
		name: 'Benedict Evans',
		role: guestAuthority('Benedict Evans'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers'],
		chainId: 'INS-90',
		sourceRef: 'https://www.youtube.com/watch?v=BD3vLtWhT5A',
		published: true,
		staged: true
	},
	{
		id: 'benedict-going-to-be-okay',
		quote: "It's probably going to be okay — if you engage instead of opting out.",
		name: 'Benedict Evans',
		role: guestAuthority('Benedict Evans'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['teams-going-faster', 'indie-makers'],
		chainId: 'INS-87',
		sourceRef: 'https://www.youtube.com/watch?v=BD3vLtWhT5A',
		published: true,
		staged: true
	},
	{
		id: 'tony-cognitively-surrender',
		quote:
			"You still need humans in the loop. Don't surrender to the machine — use AI, but don't cognitively surrender.",
		name: 'Tony Fadell',
		role: guestAuthority('Tony Fadell'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['agent-curious-engineers', 'product-leaders', 'product-managers'],
		chainId: 'INS-106',
		sourceRef: 'https://www.youtube.com/watch?v=RJjl1TwyfWM',
		published: true,
		staged: true
	},
	{
		id: 'tony-three-generations',
		quote:
			'Make the product, fix the product, then fix the business — no one gets it all right the first time.',
		name: 'Tony Fadell',
		role: guestAuthority('Tony Fadell'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'indie-makers'],
		chainId: 'INS-108',
		sourceRef: 'https://www.youtube.com/watch?v=RJjl1TwyfWM',
		published: true,
		staged: true
	},
	{
		id: 'tony-start-from-pain',
		quote: "I always start from pain — some people start elsewhere, but that's where I start.",
		name: 'Tony Fadell',
		role: guestAuthority('Tony Fadell'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-managers', 'indie-makers'],
		chainId: 'INS-109',
		sourceRef: 'https://www.youtube.com/watch?v=RJjl1TwyfWM',
		published: true,
		staged: true
	},
	{
		id: 'tony-technology-serves-customer',
		quote: 'The technology is in service of the customer — not jamming tech down their throat.',
		name: 'Tony Fadell',
		role: guestAuthority('Tony Fadell'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'designers-who-build', 'founders'],
		chainId: 'INS-107',
		sourceRef: 'https://www.youtube.com/watch?v=RJjl1TwyfWM',
		published: true,
		staged: true
	},
	{
		id: 'tony-benevolent-dictatorship',
		quote:
			"For a 1.0 product, this is a benevolent dictatorship — here's the vision. We won't know until we ship and hear from users.",
		name: 'Tony Fadell',
		role: guestAuthority('Tony Fadell'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders'],
		chainId: 'INS-105',
		sourceRef: 'https://www.youtube.com/watch?v=RJjl1TwyfWM',
		published: true,
		staged: true
	},
	{
		id: 'cat-remove-barriers',
		quote:
			'We want to remove every single barrier to shipping — timelines went from six months to one week, sometimes one day.',
		name: 'Cat Wu',
		role: guestAuthority('Cat Wu'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-119',
		sourceRef: 'https://www.youtube.com/watch?v=PplmzlgE0kg',
		published: true,
		staged: true
	},
	{
		id: 'cat-just-do-things',
		quote:
			"Just do things. If you know what you're optimizing for and you have strong first principles, you can normally deduce the right course of action.",
		name: 'Cat Wu',
		role: guestAuthority('Cat Wu'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-120',
		sourceRef: 'https://www.youtube.com/watch?v=PplmzlgE0kg',
		published: true,
		staged: true
	},
	{
		id: 'cat-agi-pilled',
		quote:
			"It's hard to be the right amount of AGI-pilled. The hard thing is eliciting maximum capability from the current model, not the super-AGI fantasy.",
		name: 'Cat Wu',
		role: guestAuthority('Cat Wu'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-121',
		sourceRef: 'https://www.youtube.com/watch?v=PplmzlgE0kg',
		published: true,
		staged: true
	},
	{
		id: 'cat-concept-corner',
		quote:
			"Make a concept corner of the product suite — an engineer or PM has an idea and by end of week it's in users' hands.",
		name: 'Cat Wu',
		role: guestAuthority('Cat Wu'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-122',
		sourceRef: 'https://www.youtube.com/watch?v=PplmzlgE0kg',
		published: true,
		staged: true
	},
	{
		id: 'cat-buggy-launch',
		quote:
			'Launching something buggy used to keep me up at night. Now I can live with it — we get quick feedback and fix it in the next release.',
		name: 'Cat Wu',
		role: guestAuthority('Cat Wu'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'indie-makers', 'designers-who-build'],
		chainId: 'INS-123',
		sourceRef: 'https://www.youtube.com/watch?v=PplmzlgE0kg',
		published: true,
		staged: true
	}
];

export function publishedVoices(all: Voice[] = voices): Voice[] {
	return all.filter((v) => v.published);
}

export function stagedVoices(all: Voice[] = voices): Voice[] {
	return all.filter((v) => v.staged);
}

/** Voices tagged for a persona (multi-tag allowed). */
export function voicesForPersona(personaId: PersonaId, all: Voice[] = voices): Voice[] {
	return all.filter((v) => v.personaIds.includes(personaId));
}

/** Count voices per persona — useful when expanding the persona list. */
export function voiceCountsByPersona(all: Voice[] = voices): Record<PersonaId, number> {
	const counts = {} as Record<PersonaId, number>;
	for (const id of PERSONA_IDS) {
		counts[id] = voicesForPersona(id, all).length;
	}
	return counts;
}

/** Cards cleared for the current environment (mirrors testimonials.ts). */
export function displayVoices(all: Voice[] = voices): Voice[] {
	if (import.meta.env.DEV) return all;
	const published = publishedVoices(all);
	if (published.length > 0) return published;
	// Optional prod preview until QUE-5 closes — set PUBLIC_VOICE_PREVIEW=true on Railway.
	if (import.meta.env.PUBLIC_VOICE_PREVIEW === 'true') return stagedVoices(all);
	return [];
}
