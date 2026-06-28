/// <reference types="unplugin-icons/types/svelte" />
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface ImportMetaEnv {
	readonly PUBLIC_POSTHOG_KEY?: string;
	readonly PUBLIC_POSTHOG_HOST?: string;
	readonly PUBLIC_FF_AI_CHAT?: string;
	readonly PUBLIC_FF_AI_VOICE?: string;
	readonly PUBLIC_FF_PREMIUM_PROGRAMS?: string;
	readonly PUBLIC_FF_SHARE_POLICIES?: string;
	readonly PUBLIC_VOICE_PREVIEW?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- augments Vite ImportMeta
interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
