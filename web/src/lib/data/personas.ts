/**
 * Canonical FunCode personas (AUD-1 segments). Shared by hero AudienceCluster,
 * "Who it's for", thought-leader voice cards, and `/for/[persona]` pages.
 *
 * Expand here — hero chips, voice grouping, and persona routes stay in sync.
 */
export const PERSONA_IDS = [
	'product-managers',
	'product-leaders',
	'designers-who-build',
	'founders',
	'indie-makers',
	'agent-curious-engineers',
	'teams-going-faster'
] as const;

export type PersonaId = (typeof PERSONA_IDS)[number];

export type Persona = {
	id: PersonaId;
	/** URL segment for `/for/[persona]` routes. */
	slug: PersonaId;
	emoji: string;
	label: string;
	/** Persona landing page subhead — humble, STD-4. */
	tagline: string;
};

/** Selectable personas (excludes the hero "…and you" invitation chip). */
export const personas: Persona[] = [
	{
		id: 'product-managers',
		slug: 'product-managers',
		emoji: '🧭',
		label: 'Product managers',
		tagline:
			'Ship prototypes instead of polishing slide decks — with agents that remember your decisions.'
	},
	{
		id: 'product-leaders',
		slug: 'product-leaders',
		emoji: '🎯',
		label: 'Product leaders',
		tagline:
			'Set direction while the ground shifts — measured takes from operators navigating AI in public.'
	},
	{
		id: 'designers-who-build',
		slug: 'designers-who-build',
		emoji: '🎨',
		label: 'Designers who build now',
		tagline:
			'Sketch in code, poke at prototypes, and keep taste in the loop while agents do the typing.'
	},
	{
		id: 'founders',
		slug: 'founders',
		emoji: '🚀',
		label: 'Founders',
		tagline: 'Burn the resume energy on what your customers feel — not what peers applaud.'
	},
	{
		id: 'indie-makers',
		slug: 'indie-makers',
		emoji: '🛠️',
		label: 'Indie makers',
		tagline: 'Small bets, fast loops, new mistakes — build in the open without a planning cycle.'
	},
	{
		id: 'agent-curious-engineers',
		slug: 'agent-curious-engineers',
		emoji: '🤖',
		label: 'Agent-curious engineers',
		tagline:
			'Stay on the capability curve — models, harnesses, and the humans who make agents work.'
	},
	{
		id: 'teams-going-faster',
		slug: 'teams-going-faster',
		emoji: '⚡',
		label: 'Teams going faster',
		tagline: 'Shared sandboxes, forward-deployed curiosity, and room to rethink workflows together.'
	}
];

/** Shape consumed by AudienceCluster / AudienceChip in the hero. */
export type AudienceChipItem = {
	emoji: string;
	label: string;
	you?: boolean;
	personaId?: PersonaId;
};

/** Hero + "Who it's for" chips — personas plus the accent invitation. */
export function heroAudienceChips(): AudienceChipItem[] {
	return [
		...personas.map((p) => ({
			emoji: p.emoji,
			label: p.label,
			personaId: p.id
		})),
		{ emoji: '👋', label: '…and you', you: true }
	];
}

export function personaById(id: PersonaId): Persona {
	const found = personas.find((p) => p.id === id);
	if (!found) throw new Error(`Unknown persona: ${id}`);
	return found;
}

export function personaBySlug(slug: string): Persona | undefined {
	return personas.find((p) => p.slug === slug);
}

export function isPersonaId(value: string): value is PersonaId {
	return (PERSONA_IDS as readonly string[]).includes(value);
}
