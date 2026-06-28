/**
 * Feature flags — env defaults + PostHog override when configured (INS-389).
 * Premium features stay off in production until explicitly enabled.
 */
import { getPostHogFlag } from './posthog';

export type FeatureFlag =
	'premium-ai-chat' | 'premium-ai-voice' | 'premium-programs' | 'premium-sharing';

const ENV_KEYS: Record<FeatureFlag, string> = {
	'premium-ai-chat': 'PUBLIC_FF_AI_CHAT',
	'premium-ai-voice': 'PUBLIC_FF_AI_VOICE',
	'premium-programs': 'PUBLIC_FF_PREMIUM_PROGRAMS',
	'premium-sharing': 'PUBLIC_FF_SHARE_POLICIES'
};

function envDefault(flag: FeatureFlag): boolean {
	const key = ENV_KEYS[flag];
	const raw = import.meta.env[key as keyof ImportMetaEnv];
	if (raw === 'true') return true;
	if (raw === 'false') return false;
	// Prototype: mock AI chat on in dev unless explicitly disabled
	if (flag === 'premium-ai-chat' && import.meta.env.DEV) return true;
	return false;
}

/** Sync check — PostHog may not be loaded yet; use isFeatureEnabledAsync after init. */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
	const ph = getPostHogFlag(flag);
	if (ph !== undefined) return ph;
	return envDefault(flag);
}

export async function isFeatureEnabledAsync(flag: FeatureFlag): Promise<boolean> {
	const { whenPostHogReady } = await import('./posthog');
	await whenPostHogReady();
	return isFeatureEnabled(flag);
}

export function programVisible(tier: 'free' | 'premium'): boolean {
	if (tier === 'free') return true;
	return isFeatureEnabled('premium-programs');
}
