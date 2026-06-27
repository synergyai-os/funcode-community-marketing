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
	}
];

const byName = new Map(VOICE_GUESTS.map((g) => [g.name, g]));

export function guestAuthority(name: string): string {
	return byName.get(name)?.authority ?? 'Lenny\'s Podcast guest';
}

export function guestLandId(name: string): string | undefined {
	return byName.get(name)?.landId;
}
