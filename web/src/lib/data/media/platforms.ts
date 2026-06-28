/** Platforms FunCode learns from — hosts ≠ guests. Slugs match ingest media-platforms.ts. */
export type MediaChannel = {
	kind: 'youtube' | 'spotify' | 'apple-podcasts' | 'instagram' | 'linkedin' | 'website';
	label: string;
	url?: string;
};

export type MediaPlatform = {
	slug: string;
	name: string;
	landId?: string;
	hosts: string[];
	kind: 'podcast' | 'video' | 'news' | 'mixed';
	tagline: string;
	channels: MediaChannel[];
};

export const mediaPlatforms: MediaPlatform[] = [
	{
		slug: 'lennys-podcast',
		name: "Lenny's Podcast",
		landId: 'LAND-1',
		hosts: ['Lenny Rachitsky'],
		kind: 'podcast',
		tagline: 'Product, growth, and the operators shipping with AI.',
		channels: [
			{ kind: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@LennysPodcast' },
			{
				kind: 'spotify',
				label: 'Spotify',
				url: 'https://open.spotify.com/show/4aRP2XSavdtrLG5FZoonOK'
			},
			{ kind: 'website', label: 'Newsletter', url: 'https://www.lennysnewsletter.com/' }
		]
	},
	{
		slug: 'lex-fridman',
		name: 'Lex Fridman Podcast',
		hosts: ['Lex Fridman'],
		kind: 'podcast',
		tagline: 'Long-form conversations on science, AI, and building.',
		channels: [
			{ kind: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@lexfridman' },
			{
				kind: 'spotify',
				label: 'Spotify',
				url: 'https://open.spotify.com/show/2MAiHVXNL0FnJLYHU4Kk8K'
			},
			{ kind: 'website', label: 'Site', url: 'https://lexfridman.com/podcast' }
		]
	},
	{
		slug: '20vc',
		name: '20VC with Harry Stebbings',
		hosts: ['Harry Stebbings'],
		kind: 'podcast',
		tagline: 'Venture, operators, and how companies get built.',
		channels: [
			{ kind: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@20VC' },
			{
				kind: 'spotify',
				label: 'Spotify',
				url: 'https://open.spotify.com/show/6liss8Q8Tp0CQXq95yQj0K'
			}
		]
	},
	{
		slug: 'all-in',
		name: 'All-In Podcast',
		hosts: ['Chamath Palihapitiya', 'Jason Calacanis', 'David Sacks', 'David Friedberg'],
		kind: 'podcast',
		tagline: 'Tech, markets, and blunt takes from four operators.',
		channels: [
			{ kind: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@allin' },
			{
				kind: 'spotify',
				label: 'Spotify',
				url: 'https://open.spotify.com/show/78rKb5EUB5U2L0J9IhH9xK'
			}
		]
	},
	{
		slug: 'the-futur',
		name: 'The Futur with Chris Do',
		hosts: ['Chris Do'],
		kind: 'mixed',
		tagline: 'Design business, creative leadership, and doing the work.',
		channels: [
			{ kind: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/c/thefutur' },
			{
				kind: 'spotify',
				label: 'Spotify',
				url: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrrwZBZYM'
			},
			{ kind: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/thefutur/' },
			{ kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/the-futur/' }
		]
	},
	{
		slug: 'cnbc',
		name: 'CNBC',
		hosts: [],
		kind: 'news',
		tagline: 'News clips — useful signal, not full long-form ingest.',
		channels: [{ kind: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@CNBC' }]
	}
];

export function platformBySlug(slug: string): MediaPlatform | undefined {
	return mediaPlatforms.find((p) => p.slug === slug);
}
