import { communityGenerated } from '$lib/data/community/generated';
import type { AgentSnippet } from '$lib/data/community/types';

export type ChatMessage = {
	id: string;
	role: 'user' | 'assistant';
	text: string;
	sources?: { title: string; guest: string }[];
};

export type ChatContext = {
	pageTitle: string;
	pageKind: 'media' | 'mental-model' | 'share' | 'program';
};

function tokenize(text: string): string[] {
	return text
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((t) => t.length > 2);
}

function scoreSnippet(query: string, snippet: AgentSnippet): number {
	const q = tokenize(query);
	if (q.length === 0) return 0;
	const hay = `${snippet.title} ${snippet.guest} ${snippet.text}`.toLowerCase();
	return q.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
}

function topSnippets(query: string, limit = 3): AgentSnippet[] {
	return [...communityGenerated.agentSnippets]
		.map((s) => ({ s, score: scoreSnippet(query, s) }))
		.filter((x) => x.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((x) => x.s);
}

const GREETINGS = ['hello', 'hi', 'hey', 'help'];

export function mockAgentReply(userText: string, context: ChatContext): ChatMessage {
	const trimmed = userText.trim();
	const lower = trimmed.toLowerCase();

	if (GREETINGS.some((g) => lower.startsWith(g))) {
		return {
			id: crypto.randomUUID(),
			role: 'assistant',
			text: `I'm a prototype agent on ${context.pageTitle}. Ask about what we learn from leaders, the mental model shift, Play Rooms, or pb orient — I'll pull from Chain-backed snippets (no live LLM yet).`,
			sources: []
		};
	}

	if (lower.includes('play room') || lower.includes('playground') || lower.includes('pr ')) {
		return {
			id: crypto.randomUUID(),
			role: 'assistant',
			text: 'FunCode treats PRs as a playground — the codebase is a shared sandbox. You build in the open; what works ships, what does not gets deleted or handed off. No shame in trying.',
			sources: [{ title: 'FunCode mental model', guest: 'FunCode' }]
		};
	}

	if (lower.includes('free') || lower.includes('cost') || lower.includes('pay')) {
		return {
			id: crypto.randomUUID(),
			role: 'assistant',
			text: 'Every rung of the engagement ladder (GLO-9) is free — watch, read, try, discuss, start, build with tools. Premium agentic chat and voice will sit behind feature flags until ready (TEN-2).',
			sources: []
		};
	}

	const hits = topSnippets(trimmed);
	if (hits.length > 0) {
		const lead = hits[0];
		return {
			id: crypto.randomUUID(),
			role: 'assistant',
			text: `${lead.text} — grounded in our ingested sources, not invented.`,
			sources: hits.map((h) => ({ title: h.title, guest: h.guest }))
		};
	}

	return {
		id: crypto.randomUUID(),
		role: 'assistant',
		text: `I don't have a strong match in the prototype knowledge bundle for that. Try asking about the old vs new mental model, a guest you've seen on /media, or how onboarding (fork → orient → Play Room) works.`,
		sources: []
	};
}
