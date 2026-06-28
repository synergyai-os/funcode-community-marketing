import { getContext, setContext } from 'svelte';

const JOIN_KEY = Symbol('funcode-join');

export type JoinContext = {
	readonly open: boolean;
	openJoin: (intent?: string) => void;
	closeJoin: () => void;
	readonly intent: string | undefined;
};

export function setJoinContext(ctx: JoinContext): void {
	setContext(JOIN_KEY, ctx);
}

export function getJoinContext(): JoinContext {
	const ctx = getContext<JoinContext>(JOIN_KEY);
	if (!ctx) {
		throw new Error('JoinContext not found — wrap the app in JoinProvider');
	}
	return ctx;
}

/** Safe for optional use outside provider (returns no-op). */
export function tryJoinContext(): JoinContext | null {
	try {
		return getContext<JoinContext>(JOIN_KEY);
	} catch {
		return null;
	}
}

const STORAGE_KEY = 'funcode-join-emails';

export function captureJoinEmail(email: string, intent?: string): void {
	if (typeof localStorage === 'undefined') return;
	const entry = { email, intent: intent ?? 'join', at: new Date().toISOString() };
	const existing = localStorage.getItem(STORAGE_KEY);
	const list: (typeof entry)[] = existing ? (JSON.parse(existing) as (typeof entry)[]) : [];
	list.push(entry);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
