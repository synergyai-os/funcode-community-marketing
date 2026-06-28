/**
 * PostHog stub — env-gated init (LAND-57, INS-389).
 * No-op when PUBLIC_POSTHOG_KEY is unset.
 */

type PostHogClient = {
	isFeatureEnabled: (flag: string) => boolean | undefined;
	capture: (event: string, properties?: Record<string, unknown>) => void;
	identify: (distinctId: string, properties?: Record<string, unknown>) => void;
};

let client: PostHogClient | null = null;
let ready = false;
let readyResolve: (() => void) | null = null;
const readyPromise = new Promise<void>((resolve) => {
	readyResolve = resolve;
});

const KEY = import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined;
const HOST =
	(import.meta.env.PUBLIC_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com';

export function isPostHogConfigured(): boolean {
	return Boolean(KEY && KEY.length > 0);
}

export async function initPostHog(): Promise<void> {
	if (!isPostHogConfigured() || typeof window === 'undefined' || client) {
		if (!isPostHogConfigured()) {
			ready = true;
			readyResolve?.();
		}
		return;
	}

	const { default: posthog } = await import('posthog-js');
	posthog.init(KEY!, {
		api_host: HOST,
		person_profiles: 'identified_only',
		capture_pageview: true,
		capture_pageleave: true,
		loaded: (ph: PostHogClient) => {
			client = ph;
			ready = true;
			readyResolve?.();
		}
	});
	client = posthog as PostHogClient;
}

export function whenPostHogReady(): Promise<void> {
	if (ready) return Promise.resolve();
	return readyPromise;
}

export function getPostHogFlag(flag: string): boolean | undefined {
	if (!client || !ready) return undefined;
	const value = client.isFeatureEnabled(flag);
	return value === undefined ? undefined : Boolean(value);
}

export function captureEvent(event: string, properties?: Record<string, unknown>): void {
	if (!client || !ready) return;
	client.capture(event, properties);
}

export function identifyUser(distinctId: string, properties?: Record<string, unknown>): void {
	if (!client || !ready) return;
	client.identify(distinctId, properties);
}
