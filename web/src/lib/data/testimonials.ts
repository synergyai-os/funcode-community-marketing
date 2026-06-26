/**
 * Testimonial content for the landing `#builders` deck.
 *
 * Governance: only quotes with `consent: true` may ever render publicly
 * (TEN-5 — no fabricated testimonials; BR-3 — publishing fake quotes is a
 * trust-sinking, below-the-waterline move). The entries below are illustrative
 * placeholders in the FunCode voice (STD-4) with `consent: false`; `published()`
 * filters them out, so the page shows an honest "stories soon" card until real,
 * consented member quotes land. Flipping a quote to `consent: true` lights up the
 * deck automatically — no code change beyond the data.
 */
export type Quote = {
	quote: string;
	/** Full name; also drives the avatar initials. Only shown if `consent` is true. */
	name: string;
	/** Short role/segment, e.g. "Product manager". */
	role: string;
	/** Whether the person consented to public attribution. Launch gate (TEN-5/BR-3). */
	consent: boolean;
	/** Optional link to the source (post, review, message). */
	source?: string;
	/** Optional ISO date the quote was given. */
	date?: string;
};

export const testimonials: Quote[] = [
	{
		quote:
			'I used to write PRDs nobody read. Now I ship a prototype and let people poke at it — way more fun, and way more honest.',
		name: 'Maya Pereira',
		role: 'Product manager',
		consent: false
	},
	{
		quote:
			'The Play Room reframe killed my fear of the merge button. I build in the open and bin what doesn’t work. No drama.',
		name: 'Tom de Vries',
		role: 'Designer',
		consent: false
	},
	{
		quote:
			'First weekend in, I had a working prototype. The agent did the heavy lifting; I just kept steering.',
		name: 'Sofia Lindqvist',
		role: 'Founder',
		consent: false
	},
	{
		quote:
			'I’m not an engineer, but I’m shipping. Turns out clear intent beats clever prompts every time.',
		name: 'Daniel Osei',
		role: 'Indie maker',
		consent: false
	},
	{
		quote:
			'Orienting the agent on the Chain means it stops undoing my past decisions. That alone changed everything.',
		name: 'Priya Nair',
		role: 'Product manager',
		consent: false
	},
	{
		quote: 'It’s free, it’s kind, and people actually help. Rare combo these days.',
		name: 'Lukas Berg',
		role: 'Agent-curious engineer',
		consent: false
	}
];

/** The quotes cleared for public display — the only ones that may ever render. */
export function published(quotes: Quote[]): Quote[] {
	return quotes.filter((q) => q.consent);
}
