/** FunCode workflow tools — landscape entities we use or recommend (INS-1: not a flat stack). */
export type WorkflowTool = {
	slug: string;
	name: string;
	tagline: string;
	/** Match guest quotes / insights in build-media-data.mjs */
	aliases: string[];
	url?: string;
	category: 'build' | 'knowledge' | 'backend' | 'deploy' | 'media';
};

export const workflowTools: WorkflowTool[] = [
	{
		slug: 'cursor',
		name: 'Cursor',
		tagline: 'Agentic IDE — where FunCode members pair with models on real repos.',
		aliases: ['cursor', 'cursor ide', 'cursor agent'],
		url: 'https://cursor.com',
		category: 'build'
	},
	{
		slug: 'product-brain',
		name: 'Product Brain',
		tagline: 'Chain SSOT — capture, relate, and orient agents on durable knowledge.',
		aliases: ['product brain', 'pb cli', 'pb ', 'chain'],
		url: 'https://productbrain.io',
		category: 'knowledge'
	},
	{
		slug: 'convex',
		name: 'Convex',
		tagline: 'Reactive backend when a prototype needs real data and auth.',
		aliases: ['convex'],
		url: 'https://convex.dev',
		category: 'backend'
	},
	{
		slug: 'openrouter',
		name: 'OpenRouter',
		tagline: 'Model routing for ingest STT + extraction in our pipeline.',
		aliases: ['openrouter', 'whisper'],
		url: 'https://openrouter.ai',
		category: 'build'
	},
	{
		slug: 'codex',
		name: 'OpenAI Codex',
		tagline: 'Agentic coding — guests like Andrew Ambrosino shape how product work shifts.',
		aliases: ['codex', 'openai codex'],
		url: 'https://openai.com/codex',
		category: 'build'
	},
	{
		slug: 'claude-code',
		name: 'Claude Code',
		tagline: 'Terminal-native agent loop for long-horizon repo work.',
		aliases: ['claude code', 'claude'],
		url: 'https://docs.anthropic.com/en/docs/claude-code',
		category: 'build'
	},
	{
		slug: 'railway',
		name: 'Railway',
		tagline: 'Deploy funcode.club — SvelteKit on adapter-node, PORT 8080.',
		aliases: ['railway'],
		url: 'https://railway.app',
		category: 'deploy'
	},
	{
		slug: 'yt-dlp',
		name: 'yt-dlp',
		tagline: 'Audio pull for podcast ingest — YouTube-first until Spotify DRM is solved.',
		aliases: ['yt-dlp', 'youtube-dl'],
		category: 'media'
	}
];

export function toolBySlug(slug: string): WorkflowTool | undefined {
	return workflowTools.find((t) => t.slug === slug);
}
