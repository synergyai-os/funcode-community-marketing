/**
 * Thought-leader registry — authority lines from Chain LAND guests (STD-6).
 * Ingest sync (PAT-7) updates this file; voice cards reference by guest name.
 */
export type VoiceGuest = {
	/** Display name as on cards. */
	name: string;
	/** Humble authority under the name — title/company, not a brag stack. */
	authority: string;
	/** Chain LAND entry when known. */
	landId?: string;
};

export const VOICE_GUESTS: VoiceGuest[] = [
	{
		name: 'Fiona Fung',
		authority: 'Claude Code & Cowork, Anthropic',
		landId: 'LAND-26'
	},
	{
		name: 'Mark Pincus',
		authority: 'Founder, Zynga',
		landId: 'LAND-27'
	},
	{
		name: 'Dan Shipper',
		authority: 'CEO, Every'
	},
	{
		name: 'Benedict Evans',
		authority: 'Independent tech analyst',
		landId: 'LAND-34'
	},
	{
		name: 'Tony Fadell',
		authority: 'Creator, iPod & iPhone · Nest',
		landId: 'LAND-35'
	},
	{
		name: 'Cat Wu',
		authority: 'Head of Product, Claude Code · Anthropic',
		landId: 'LAND-36'
	},
	{
		name: 'Evan Spiegel',
		authority: 'Snapchat CEO',
		landId: 'LAND-52'
	},
	{
		name: 'Keith Rabois',
		authority: 'Khosla Ventures',
		landId: 'LAND-39'
	},
	{
		name: 'Amol Avasari',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-40'
	},
	{
		name: 'Simon Wilson',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-41'
	},
	{
		name: 'Claire Vo',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-42'
	},
	{
		name: 'Jessica Fain',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-43'
	},
	{
		name: 'Jenny Wen (head of design at Claude)',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-44'
	},
	{
		name: 'Qasar Younis',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-45'
	},
	{
		name: "Michelle Rial (Lenny's wife)",
		authority: "Lenny's Podcast guest",
		landId: 'LAND-47'
	},
	{
		name: 'Jacob Warwick',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-48'
	},
	{
		name: 'Max Schoening (Notion)',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-49'
	},
	{
		name: 'Eric Ries',
		authority: "Lenny's Podcast guest",
		landId: 'LAND-50'
	},
	{
		name: 'Caitlin Kalinowski',
		authority: 'ex-OpenAI, Meta, Apple',
		landId: 'LAND-51'
	},
	{
		name: 'Nikhyl Singhal',
		authority: 'Meta, Google',
		landId: 'LAND-37'
	},
	{
		name: 'Andrew Ambrosino',
		authority: 'OpenAI Codex app lead',
		landId: 'LAND-53'
	}
];

const byName = new Map(VOICE_GUESTS.map((g) => [g.name, g]));

export function guestAuthority(name: string): string {
	return byName.get(name)?.authority ?? "Lenny's Podcast guest";
}

export function guestLandId(name: string): string | undefined {
	return byName.get(name)?.landId;
}
