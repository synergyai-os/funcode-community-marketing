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
	},
	{
		id: 'nikhyl-builders-wanted',
		quote: 'Builders Wanted is going to be the big tagline for the next couple of years',
		name: 'Nikhyl Singhal',
		role: guestAuthority('Nikhyl Singhal'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-136',
		sourceRef: 'https://www.youtube.com/watch?v=yUohoaC8_Hs',
		published: true,
		staged: true
	},
	{
		id: 'nikhyl-fire-in-the-belly',
		quote: 'The next two years requires a lot of fire in the belly',
		name: 'Nikhyl Singhal',
		role: guestAuthority('Nikhyl Singhal'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'indie-makers', 'founders'],
		chainId: 'INS-137',
		sourceRef: 'https://www.youtube.com/watch?v=yUohoaC8_Hs',
		published: true,
		staged: true
	},
	{
		id: 'nikhyl-cross-the-threshold',
		quote:
			'every person listening to this podcast needs to find it in themselves to cross the threshold around embracing reinvention',
		name: 'Nikhyl Singhal',
		role: guestAuthority('Nikhyl Singhal'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-138',
		sourceRef: 'https://www.youtube.com/watch?v=yUohoaC8_Hs',
		published: true,
		staged: true
	},
	{
		id: 'nikhyl-smiling-exhaustion',
		quote:
			"it's smiling exhaustion. I see in my community. Everyone, and before it was just exhaustion. I take smiling over exhaustion",
		name: 'Nikhyl Singhal',
		role: guestAuthority('Nikhyl Singhal'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-139',
		sourceRef: 'https://www.youtube.com/watch?v=yUohoaC8_Hs',
		published: true,
		staged: true
	},
	{
		id: 'nikhyl-vibe-coding',
		quote:
			'I try to find TV shows that I can vibe code in parallel to because I want to watch TV, but I want to be vibe coding at the same time',
		name: 'Nikhyl Singhal',
		role: guestAuthority('Nikhyl Singhal'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'teams-going-faster'],
		chainId: 'INS-140',
		sourceRef: 'https://www.youtube.com/watch?v=yUohoaC8_Hs',
		published: true,
		staged: true
	},
	{
		id: 'keith-barrels',
		quote:
			"Can they take an idea and make it happen? Basically, we're going up that, there's a hill over there. That's the hill. get us over that hill in one way or the other they will motivate people if they need to they will accumulate resources if they need to they will measure what they need to, and they're going to get your company across that hill. That's a barrel.",
		name: 'Keith Rabois',
		role: guestAuthority('Keith Rabois'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-150',
		sourceRef: 'https://www.youtube.com/watch?v=xCd9ykretlg',
		published: true,
		staged: true
	},
	{
		id: 'keith-no-days-off',
		quote:
			"No days off. Hashtag no days off. I don't believe in taking days off from workout. I don't believe taking days off from work, period.",
		name: 'Keith Rabois',
		role: guestAuthority('Keith Rabois'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-151',
		sourceRef: 'https://www.youtube.com/watch?v=xCd9ykretlg',
		published: true,
		staged: true
	},
	{
		id: 'keith-ugly-baby',
		quote:
			"I want half of my friends who are VCs to laugh at me. Like literally laugh because I know most of the people I compete with pretty well. And so I'm running this algorithm through my brain. Are these people going to laugh? If so, like this is a great investment, potentially great investment because it's an ugly baby. And ugly babies are the ones where there's real alpha.",
		name: 'Keith Rabois',
		role: guestAuthority('Keith Rabois'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-152',
		sourceRef: 'https://www.youtube.com/watch?v=xCd9ykretlg',
		published: true,
		staged: true
	},
	{
		id: 'keith-relentless-application-of-force',
		quote:
			"A friend of mine who's a CEO once asked Mike Moore, it's like, what's the most common denominator of the best CEOs ever? And he said it's the relentless application of force, quote. I think that's the job of the CEO.",
		name: 'Keith Rabois',
		role: guestAuthority('Keith Rabois'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-153',
		sourceRef: 'https://www.youtube.com/watch?v=xCd9ykretlg',
		published: true,
		staged: true
	},
	{
		id: 'amol-success-disasters',
		quote:
			'roughly 70% of what I spend my time on is what we internally refer to as success disasters. And that is where like things have gone so well that other things are breaking now',
		name: 'Amol Avasari',
		role: guestAuthority('Amol Avasari'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-163',
		sourceRef: 'https://www.youtube.com/watch?v=k-H4nsOTuxU',
		published: true,
		staged: true
	},
	{
		id: 'amol-freedom-through-constraints',
		quote:
			"there's like this broader principle I have just around life of like the freedom through constraints that when you when you have a bunch of constraints applied on you... it can bring a lot of freedom because it just frees up all this excess choice",
		name: 'Amol Avasari',
		role: guestAuthority('Amol Avasari'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'teams-going-faster'],
		chainId: 'INS-164',
		sourceRef: 'https://www.youtube.com/watch?v=k-H4nsOTuxU',
		published: true,
		staged: true
	},
	{
		id: 'amol-she-ll-be-right',
		quote:
			"The main one I'd say is just, 'She'll be right.' This is a very common Aussie saying... You're kind of like missing the severity of it in a way by saying like, yeah, it'll be fine",
		name: 'Amol Avasari',
		role: guestAuthority('Amol Avasari'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-165',
		sourceRef: 'https://www.youtube.com/watch?v=k-H4nsOTuxU',
		published: true,
		staged: true
	},
	{
		id: 'simon-vibe-coding-liberation',
		quote:
			'I love that liberation and I love that people can come to meetings with a prototype that they knocked up of their idea that illustrates the idea',
		name: 'Simon Wilson',
		role: guestAuthority('Simon Wilson'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'teams-going-faster'],
		chainId: 'INS-175',
		sourceRef: 'https://www.youtube.com/watch?v=wc8FBhQtdsA',
		published: true,
		staged: true
	},
	{
		id: 'simon-the-new-ambition-mindset',
		quote:
			"My New Year's resolution, every previous year, I've always told myself, this year, I'm going to focus more, I'm going to take on less things. This year... My ambition was take on more stuff and be more ambitious",
		name: 'Simon Wilson',
		role: guestAuthority('Simon Wilson'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-176',
		sourceRef: 'https://www.youtube.com/watch?v=wc8FBhQtdsA',
		published: true,
		staged: true
	},
	{
		id: 'simon-mobile-first-development',
		quote:
			"I write so much of my code on my phone, it's wild. I can get good work done walking the dog along the beach",
		name: 'Simon Wilson',
		role: guestAuthority('Simon Wilson'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-177',
		sourceRef: 'https://www.youtube.com/watch?v=wc8FBhQtdsA',
		published: true,
		staged: true
	},
	{
		id: 'simon-the-exhaustion-paradox',
		quote:
			'I can fire up four agents in parallel and have them work on four different problems by... 11 a.m. I am wiped out',
		name: 'Simon Wilson',
		role: guestAuthority('Simon Wilson'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-178',
		sourceRef: 'https://www.youtube.com/watch?v=wc8FBhQtdsA',
		published: true,
		staged: true
	},
	{
		id: 'simon-agency-as-human-superpower',
		quote:
			'people human beings have agency and we use that agency to decide what problems to take on and where to go. I think agents have no agency at all',
		name: 'Simon Wilson',
		role: guestAuthority('Simon Wilson'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-179',
		sourceRef: 'https://www.youtube.com/watch?v=wc8FBhQtdsA',
		published: true,
		staged: true
	},
	{
		id: 'simon-the-fun-factor',
		quote: "The drive here is not. I'm enjoying myself so much. Absolutely. It's so fun",
		name: 'Simon Wilson',
		role: guestAuthority('Simon Wilson'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-180',
		sourceRef: 'https://www.youtube.com/watch?v=wc8FBhQtdsA',
		published: true,
		staged: true
	},
	{
		id: 'claire-breathless-openclaw-bro',
		quote: 'I am a breathless OpenClaw bro. It has changed my life.',
		name: 'Claire Vo',
		role: guestAuthority('Claire Vo'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-190',
		sourceRef: 'https://www.youtube.com/watch?v=DIa0MYJzM5I',
		published: true,
		staged: true
	},
	{
		id: 'claire-product-market-fit-feeling',
		quote:
			"it just hit me with enough joy and enough utility when it wasn't deleting my calendar that I knew something was there",
		name: 'Claire Vo',
		role: guestAuthority('Claire Vo'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'indie-makers', 'designers-who-build'],
		chainId: 'INS-191',
		sourceRef: 'https://www.youtube.com/watch?v=DIa0MYJzM5I',
		published: true,
		staged: true
	},
	{
		id: 'claire-vibe-coding-gaming',
		quote:
			"I think vibe coding is like gaming right now. Like I haven't felt like this since I was a teenager learning code and playing video games",
		name: 'Claire Vo',
		role: guestAuthority('Claire Vo'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-192',
		sourceRef: 'https://www.youtube.com/watch?v=DIa0MYJzM5I',
		published: true,
		staged: true
	},
	{
		id: 'claire-remember-you-are-a-guest',
		quote: "Remember, you are operating in someone else's. treated accordingly.",
		name: 'Claire Vo',
		role: guestAuthority('Claire Vo'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'indie-makers', 'designers-who-build'],
		chainId: 'INS-193',
		sourceRef: 'https://www.youtube.com/watch?v=DIa0MYJzM5I',
		published: true,
		staged: true
	},
	{
		id: 'claire-fast-beats-right',
		quote:
			'fast beats right is the one that I go to on work. You can probably see I optimize for efficiency. I like to go fast.',
		name: 'Claire Vo',
		role: guestAuthority('Claire Vo'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-194',
		sourceRef: 'https://www.youtube.com/watch?v=DIa0MYJzM5I',
		published: true,
		staged: true
	},
	{
		id: 'claire-hands-for-the-ai',
		quote: "I am just hands for the AI at this point. I'm just a vessel of Polly at this point.",
		name: 'Claire Vo',
		role: guestAuthority('Claire Vo'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-195',
		sourceRef: 'https://www.youtube.com/watch?v=DIa0MYJzM5I',
		published: true,
		staged: true
	},
	{
		id: 'jessica-think-like-a-cpo',
		quote:
			'You have to act like a CPO. You have to come in with that perspective. You have to come in with a solution.',
		name: 'Jessica Fain',
		role: guestAuthority('Jessica Fain'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-204',
		sourceRef: 'https://www.youtube.com/watch?v=RP4vJeIb7WU',
		published: true,
		staged: true
	},
	{
		id: 'jessica-curiosity-over-approval',
		quote:
			'One of the most disastrous things you can do is going into a meeting just looking for approval for your plan. Instead, if what you go in with is, how can I learn? How can I strengthen this plan?',
		name: 'Jessica Fain',
		role: guestAuthority('Jessica Fain'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-205',
		sourceRef: 'https://www.youtube.com/watch?v=RP4vJeIb7WU',
		published: true,
		staged: true
	},
	{
		id: 'jessica-it-s-your-problem',
		quote:
			"It's your fault if the leaders didn't buy into your idea... you're not able to influence them and convince them that you're right.",
		name: 'Jessica Fain',
		role: guestAuthority('Jessica Fain'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-206',
		sourceRef: 'https://www.youtube.com/watch?v=RP4vJeIb7WU',
		published: true,
		staged: true
	},
	{
		id: 'jessica-strategic-context-question',
		quote: "Tell me what the board is pushing you on because everyone's got a boss.",
		name: 'Jessica Fain',
		role: guestAuthority('Jessica Fain'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'indie-makers', 'founders'],
		chainId: 'INS-207',
		sourceRef: 'https://www.youtube.com/watch?v=RP4vJeIb7WU',
		published: true,
		staged: true
	},
	{
		id: 'jenny-let-them-cook',
		quote: "You're better off not blocking that letting them cook",
		name: 'Jenny Wen (head of design at Claude)',
		role: guestAuthority('Jenny Wen (head of design at Claude)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-217',
		sourceRef: 'https://www.youtube.com/watch?v=eh8bcBIAAFo',
		published: true,
		staged: true
	},
	{
		id: 'jenny-trust-through-speed',
		quote: 'Building trust through speed',
		name: 'Jenny Wen (head of design at Claude)',
		role: guestAuthority('Jenny Wen (head of design at Claude)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'indie-makers', 'designers-who-build'],
		chainId: 'INS-218',
		sourceRef: 'https://www.youtube.com/watch?v=eh8bcBIAAFo',
		published: true,
		staged: true
	},
	{
		id: 'jenny-block-shaped-designer',
		quote:
			"People that are like almost like block shaped, you know, in that T-shaped framework where it's like, they're really good at like a few core skills like 80th percentile good",
		name: 'Jenny Wen (head of design at Claude)',
		role: guestAuthority('Jenny Wen (head of design at Claude)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'indie-makers', 'founders'],
		chainId: 'INS-219',
		sourceRef: 'https://www.youtube.com/watch?v=eh8bcBIAAFo',
		published: true,
		staged: true
	},
	{
		id: 'jenny-illegible-ideas',
		quote: "Spotting the ideas that are illegible and trying to understand what's there",
		name: 'Jenny Wen (head of design at Claude)',
		role: guestAuthority('Jenny Wen (head of design at Claude)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'designers-who-build', 'founders'],
		chainId: 'INS-220',
		sourceRef: 'https://www.youtube.com/watch?v=eh8bcBIAAFo',
		published: true,
		staged: true
	},
	{
		id: 'jenny-design-process-is-dead',
		quote:
			"This design process that designers have been taught, we sort of treat it as gospel. That's basically dead.",
		name: 'Jenny Wen (head of design at Claude)',
		role: guestAuthority('Jenny Wen (head of design at Claude)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-221',
		sourceRef: 'https://www.youtube.com/watch?v=eh8bcBIAAFo',
		published: true,
		staged: true
	},
	{
		id: 'qasar-radical-pragmatism',
		quote: 'All of our company values can be reduced. these two words of radical pragmatism.',
		name: 'Qasar Younis',
		role: guestAuthority('Qasar Younis'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-230',
		sourceRef: 'https://www.youtube.com/watch?v=_rcniEb9bLw',
		published: true,
		staged: true
	},
	{
		id: 'qasar-best-work-done-alone-and-quietly',
		quote: 'Our best work is done alone and quietly.',
		name: 'Qasar Younis',
		role: guestAuthority('Qasar Younis'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-231',
		sourceRef: 'https://www.youtube.com/watch?v=_rcniEb9bLw',
		published: true,
		staged: true
	},
	{
		id: 'qasar-physical-ai-revolution',
		quote:
			'The real impact of AI in the next five to ten years really is going to be in farming, mining, construction.',
		name: 'Qasar Younis',
		role: guestAuthority('Qasar Younis'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-232',
		sourceRef: 'https://www.youtube.com/watch?v=_rcniEb9bLw',
		published: true,
		staged: true
	},
	{
		id: 'qasar-fear-from-misunderstanding',
		quote: 'The core root of fear is misunderstanding.',
		name: 'Qasar Younis',
		role: guestAuthority('Qasar Younis'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'teams-going-faster'],
		chainId: 'INS-233',
		sourceRef: 'https://www.youtube.com/watch?v=_rcniEb9bLw',
		published: true,
		staged: true
	},
	{
		id: 'qasar-laugh-a-lot',
		quote: "Laugh a lot that's been our core value from at the beginning of the company's history.",
		name: 'Qasar Younis',
		role: guestAuthority('Qasar Younis'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-234',
		sourceRef: 'https://www.youtube.com/watch?v=_rcniEb9bLw',
		published: true,
		staged: true
	},
	{
		id: 'michelle-the-venn-diagram-of-success',
		quote:
			"How often do you enjoy something and people value it? and maybe there's a way to make money in in the future",
		name: "Michelle Rial (Lenny's wife)",
		role: guestAuthority("Michelle Rial (Lenny's wife)"),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-243',
		sourceRef: 'https://www.youtube.com/watch?v=HEqrvF7ztBE',
		published: true,
		staged: true
	},
	{
		id: 'michelle-practitioners-over-pontificators',
		quote: 'The source of the best advice is from practitioners. doing the thing for real',
		name: "Michelle Rial (Lenny's wife)",
		role: guestAuthority("Michelle Rial (Lenny's wife)"),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'indie-makers', 'designers-who-build'],
		chainId: 'INS-244',
		sourceRef: 'https://www.youtube.com/watch?v=HEqrvF7ztBE',
		published: true,
		staged: true
	},
	{
		id: 'michelle-the-indiana-jones-boulder',
		quote:
			"the visual... have is the Indiana Jones boulder is chasing me constantly. It's like this treadmill that you're on",
		name: "Michelle Rial (Lenny's wife)",
		role: guestAuthority("Michelle Rial (Lenny's wife)"),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-245',
		sourceRef: 'https://www.youtube.com/watch?v=HEqrvF7ztBE',
		published: true,
		staged: true
	},
	{
		id: 'michelle-wisdom-to-share',
		quote: 'I have wisdom to share. coming through me over and over and over',
		name: "Michelle Rial (Lenny's wife)",
		role: guestAuthority("Michelle Rial (Lenny's wife)"),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-246',
		sourceRef: 'https://www.youtube.com/watch?v=HEqrvF7ztBE',
		published: true,
		staged: true
	},
	{
		id: 'michelle-it-ll-be-alright-philosophy',
		quote: "I'm just like, it'll be alright. It'll be alright, as you know",
		name: "Michelle Rial (Lenny's wife)",
		role: guestAuthority("Michelle Rial (Lenny's wife)"),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-247',
		sourceRef: 'https://www.youtube.com/watch?v=HEqrvF7ztBE',
		published: true,
		staged: true
	},
	{
		id: 'jacob-what-s-the-chance-there-could-be-a-little-more',
		quote:
			"The simplest advice what's the chance there could be a little more that's not greedy at all",
		name: 'Jacob Warwick',
		role: guestAuthority('Jacob Warwick'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'founders'],
		chainId: 'INS-257',
		sourceRef: 'https://www.youtube.com/watch?v=pEis2CBomVA',
		published: true,
		staged: true
	},
	{
		id: 'jacob-never-be-so-sure-of-your-worth-that-you-wouldn-t-accept-',
		quote: "you should never be so sure of what you're worth that you wouldn't accept more",
		name: 'Jacob Warwick',
		role: guestAuthority('Jacob Warwick'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-258',
		sourceRef: 'https://www.youtube.com/watch?v=pEis2CBomVA',
		published: true,
		staged: true
	},
	{
		id: 'jacob-haste-equals-risk',
		quote:
			'Haste equals risk. So as you slow down, oftentimes we want to take a couple of days to respond',
		name: 'Jacob Warwick',
		role: guestAuthority('Jacob Warwick'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-259',
		sourceRef: 'https://www.youtube.com/watch?v=pEis2CBomVA',
		published: true,
		staged: true
	},
	{
		id: 'jacob-if-you-were-in-my-shoes-what-would-you-do',
		quote:
			"If you were in my shoes, like go backwards five years in your career. That's where I'm at right now. If you were in my shoes, what would you ask for?",
		name: 'Jacob Warwick',
		role: guestAuthority('Jacob Warwick'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'founders'],
		chainId: 'INS-260',
		sourceRef: 'https://www.youtube.com/watch?v=pEis2CBomVA',
		published: true,
		staged: true
	},
	{
		id: 'jacob-rising-tide-raises-all-ships',
		quote: 'Push back because a rising tide raises all ships',
		name: 'Jacob Warwick',
		role: guestAuthority('Jacob Warwick'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-261',
		sourceRef: 'https://www.youtube.com/watch?v=pEis2CBomVA',
		published: true,
		staged: true
	},
	{
		id: 'max-drive-it-like-it-s-stolen',
		quote: "I tell this to myself. You drive notion like it's stolen.",
		name: 'Max Schoening (Notion)',
		role: guestAuthority('Max Schoening (Notion)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-271',
		sourceRef: 'https://www.youtube.com/watch?v=mCO-D3pkviM',
		published: true,
		staged: true
	},
	{
		id: 'max-world-made-by-people-no-smarter-than-you',
		quote:
			'One day you wake up and you realize the world is made up by people no smarter than you. It just really awakens you to the idea that you can just change things.',
		name: 'Max Schoening (Notion)',
		role: guestAuthority('Max Schoening (Notion)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-272',
		sourceRef: 'https://www.youtube.com/watch?v=mCO-D3pkviM',
		published: true,
		staged: true
	},
	{
		id: 'max-first-10-are-now-free',
		quote:
			"If you think about your job a couple years ago, what's most changed? The first 10% of every project are now free. It takes almost no effort to now build the first version of a startup.",
		name: 'Max Schoening (Notion)',
		role: guestAuthority('Max Schoening (Notion)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-273',
		sourceRef: 'https://www.youtube.com/watch?v=mCO-D3pkviM',
		published: true,
		staged: true
	},
	{
		id: 'max-universal-basic-income-is-knowledge-work',
		quote:
			"You have this hot take on universal basic income. We already have universal basic income. It's called knowledge work.",
		name: 'Max Schoening (Notion)',
		role: guestAuthority('Max Schoening (Notion)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-274',
		sourceRef: 'https://www.youtube.com/watch?v=mCO-D3pkviM',
		published: true,
		staged: true
	},
	{
		id: 'max-demos-not-memos',
		quote:
			"We used to say this at GitHub in our product reviews a lot, which is, 'Demos, not memos.' And then we would say, give me something to react to",
		name: 'Max Schoening (Notion)',
		role: guestAuthority('Max Schoening (Notion)'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-275',
		sourceRef: 'https://www.youtube.com/watch?v=mCO-D3pkviM',
		published: true,
		staged: true
	},
	{
		id: 'eric-financial-gravity',
		quote:
			"I call it financial gravity. Like there's this kind of like thing, you know, human nature, when companies get big",
		name: 'Eric Ries',
		role: guestAuthority('Eric Ries'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-285',
		sourceRef: 'https://www.youtube.com/watch?v=PoJ1vTdHpks',
		published: true,
		staged: true
	},
	{
		id: 'eric-mission-guardian',
		quote:
			"we need what I call a mission guardian. It has to be somebody or some entity's job. to make sure that the thing remains mission locked or mission aligned",
		name: 'Eric Ries',
		role: guestAuthority('Eric Ries'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-286',
		sourceRef: 'https://www.youtube.com/watch?v=PoJ1vTdHpks',
		published: true,
		staged: true
	},
	{
		id: 'eric-harder-is-easier',
		quote:
			"This is the leadership principle I call harder is easier. If you're willing to be principled in your decision making, you will get these unexpected rewards",
		name: 'Eric Ries',
		role: guestAuthority('Eric Ries'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'indie-makers', 'designers-who-build'],
		chainId: 'INS-287',
		sourceRef: 'https://www.youtube.com/watch?v=PoJ1vTdHpks',
		published: true,
		staged: true
	},
	{
		id: 'eric-invisible-leader',
		quote:
			'the pioneering management theorist Mary Parker Follett called the invisible leader. the person, the thing that people follow, even when no manager is present',
		name: 'Eric Ries',
		role: guestAuthority('Eric Ries'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-288',
		sourceRef: 'https://www.youtube.com/watch?v=PoJ1vTdHpks',
		published: true,
		staged: true
	},
	{
		id: 'eric-mission-hopeful',
		quote:
			"Companies that claim to be mission-driven most Most of them are just mission hopeful, okay? It's bullshit. It's just a candy coating on top of an extractive engine",
		name: 'Eric Ries',
		role: guestAuthority('Eric Ries'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-289',
		sourceRef: 'https://www.youtube.com/watch?v=PoJ1vTdHpks',
		published: true,
		staged: true
	},
	{
		id: 'caitlin-ruthless-efficiency-in-hardware',
		quote:
			"You can't wait around ever. Like, there's never enough time. So if you know that you need to do something... you need to do it right now because in two days, there's going to be a surprise coming around the corner that you need that time to fix.",
		name: 'Caitlin Kalinowski',
		role: guestAuthority('Caitlin Kalinowski'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-299',
		sourceRef: 'https://www.youtube.com/watch?v=G5WTgB87rYQ',
		published: true,
		staged: true
	},
	{
		id: 'caitlin-the-physical-world-as-next-frontier',
		quote:
			'When that happens, the next frontier is the physical world. Robotics, manufacturing, industrialization.',
		name: 'Caitlin Kalinowski',
		role: guestAuthority('Caitlin Kalinowski'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-300',
		sourceRef: 'https://www.youtube.com/watch?v=G5WTgB87rYQ',
		published: true,
		staged: true
	},
	{
		id: 'caitlin-hardware-s-compilation-constraint',
		quote:
			"In hardware, we only get to compile our code, quote unquote, like four or five times... You can't ship over there updates.",
		name: 'Caitlin Kalinowski',
		role: guestAuthority('Caitlin Kalinowski'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-301',
		sourceRef: 'https://www.youtube.com/watch?v=G5WTgB87rYQ',
		published: true,
		staged: true
	},
	{
		id: 'caitlin-supply-chain-vulnerability',
		quote:
			'Every single part that goes into that robot is coming from somewhere. And many of these parts may be become more restricted or difficult to make.',
		name: 'Caitlin Kalinowski',
		role: guestAuthority('Caitlin Kalinowski'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-302',
		sourceRef: 'https://www.youtube.com/watch?v=G5WTgB87rYQ',
		published: true,
		staged: true
	},
	{
		id: 'caitlin-ai-native-engineering-advantage',
		quote:
			"They're approaching their problem solving completely differently because they're using AI from the ground up for everything. And they're much faster.",
		name: 'Caitlin Kalinowski',
		role: guestAuthority('Caitlin Kalinowski'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-managers', 'indie-makers', 'founders'],
		chainId: 'INS-303',
		sourceRef: 'https://www.youtube.com/watch?v=G5WTgB87rYQ',
		published: true,
		staged: true
	},
	{
		id: 'evan-software-is-not-a-moat',
		quote:
			'15 years ago, we essentially learned that software is not a moat, which is something that everyone is discovering today with AI.',
		name: 'Evan Spiegel',
		role: guestAuthority('Evan Spiegel'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-313',
		sourceRef: 'https://www.youtube.com/watch?v=-7Yol5vX5xw',
		published: true,
		staged: true
	},
	{
		id: 'evan-distribution-over-product-market-fit',
		quote:
			"people don't spend nearly enough time thinking about distribution and figuring out distribution. And that seems to me to be a huge differentiator.",
		name: 'Evan Spiegel',
		role: guestAuthority('Evan Spiegel'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-314',
		sourceRef: 'https://www.youtube.com/watch?v=-7Yol5vX5xw',
		published: true,
		staged: true
	},
	{
		id: 'evan-if-you-want-to-have-a-good-idea-you-have-to-have-lots-of',
		quote:
			'our favorite saying is, you know, if you want to have a good idea, you have to have lots of ideas.',
		name: 'Evan Spiegel',
		role: guestAuthority('Evan Spiegel'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-315',
		sourceRef: 'https://www.youtube.com/watch?v=-7Yol5vX5xw',
		published: true,
		staged: true
	},
	{
		id: 'evan-humanity-dictates-technology-adoption',
		quote: 'humanity is far more important because humanity dictates how technology is adopted.',
		name: 'Evan Spiegel',
		role: guestAuthority('Evan Spiegel'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-316',
		sourceRef: 'https://www.youtube.com/watch?v=-7Yol5vX5xw',
		published: true,
		staged: true
	},
	{
		id: 'evan-first-day-you-present-work',
		quote: "Your first day that you join the design team, you present work. You're making things.",
		name: 'Evan Spiegel',
		role: guestAuthority('Evan Spiegel'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'designers-who-build', 'teams-going-faster'],
		chainId: 'INS-317',
		sourceRef: 'https://www.youtube.com/watch?v=-7Yol5vX5xw',
		published: true,
		staged: true
	},
	{
		id: 'andrew-implementation-abundance',
		quote:
			"anybody can build anything. Right. Like I generally believe now that starting from scratch, if you talk to these models, ours, anybody else's really. you can stand up whatever feature you want",
		name: 'Andrew Ambrosino',
		role: guestAuthority('Andrew Ambrosino'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['founders', 'product-leaders', 'product-managers'],
		chainId: 'INS-327',
		sourceRef: 'https://www.youtube.com/watch?v=P3KDebPTUrw',
		published: true,
		staged: true
	},
	{
		id: 'andrew-taste-over-tools',
		quote:
			"It's easier to not tie your effectiveness in a role with the ability to use the exact. tool, right? It's more of like, can you get yourself into this mindset, learn which things work and which don't, and then like focus on it",
		name: 'Andrew Ambrosino',
		role: guestAuthority('Andrew Ambrosino'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['indie-makers', 'teams-going-faster'],
		chainId: 'INS-328',
		sourceRef: 'https://www.youtube.com/watch?v=P3KDebPTUrw',
		published: true,
		staged: true
	},
	{
		id: 'andrew-process-stage-clarity',
		quote:
			"you do not want to over anchor on this thing that was meant to be an exploration, but now it looks so production ready. that like oh visually it's ready for prod but it's not actually the right model of of where the research is going",
		name: 'Andrew Ambrosino',
		role: guestAuthority('Andrew Ambrosino'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-329',
		sourceRef: 'https://www.youtube.com/watch?v=P3KDebPTUrw',
		published: true,
		staged: true
	},
	{
		id: 'andrew-agency-definition',
		quote:
			'Everybody at OpenAI is very agentic, has great ideas, and so everybody is building everything',
		name: 'Andrew Ambrosino',
		role: guestAuthority('Andrew Ambrosino'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'founders'],
		chainId: 'INS-330',
		sourceRef: 'https://www.youtube.com/watch?v=P3KDebPTUrw',
		published: true,
		staged: true
	},
	{
		id: 'andrew-false-precision-warning',
		quote:
			"any amount of precision that you add. to a nine-month plan right now is false precision. And like, you're just gonna waste time",
		name: 'Andrew Ambrosino',
		role: guestAuthority('Andrew Ambrosino'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ['product-leaders', 'product-managers', 'teams-going-faster'],
		chainId: 'INS-331',
		sourceRef: 'https://www.youtube.com/watch?v=P3KDebPTUrw',
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
