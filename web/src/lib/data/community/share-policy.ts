/** Client-side share grant policy checks (prototype — no DB). */
import type { ShareGrant } from '$lib/data/community/types';

const VIEW_KEY = (token: string) => `funcode-share-views:${token}`;

export type SharePolicyResult =
	| { ok: true; viewsUsed: number; viewsRemaining: number | null }
	| { ok: false; reason: 'expired' | 'max_views' };

export function checkSharePolicy(grant: ShareGrant): SharePolicyResult {
	if (grant.expiresAt) {
		const expires = Date.parse(grant.expiresAt);
		if (!Number.isNaN(expires) && Date.now() > expires) {
			return { ok: false, reason: 'expired' };
		}
	}

	if (typeof window === 'undefined') {
		return { ok: true, viewsUsed: 0, viewsRemaining: grant.maxViews };
	}

	const used = Number(sessionStorage.getItem(VIEW_KEY(grant.token)) ?? '0');
	if (grant.maxViews !== null && used >= grant.maxViews) {
		return { ok: false, reason: 'max_views' };
	}

	return {
		ok: true,
		viewsUsed: used,
		viewsRemaining: grant.maxViews === null ? null : grant.maxViews - used
	};
}

export function recordShareView(grant: ShareGrant): void {
	if (typeof window === 'undefined') return;
	const key = VIEW_KEY(grant.token);
	const used = Number(sessionStorage.getItem(key) ?? '0');
	sessionStorage.setItem(key, String(used + 1));
}
