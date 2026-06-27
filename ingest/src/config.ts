import { existsSync } from 'node:fs';
import { config as loadDotenv } from 'dotenv';
import { envLocalPath } from './paths.js';

export type IngestConfig = {
	openRouterApiKey: string;
	sttModel: string;
	extractModel: string;
	httpReferer?: string;
	appName?: string;
};

/** Load secrets from repo-root `.env.local` only — never log values. */
export function loadConfig(): IngestConfig {
	if (!existsSync(envLocalPath)) {
		throw new Error(
			`Missing ${envLocalPath}. Copy .env.example → .env.local and set OPENROUTER_API_KEY.`
		);
	}

	loadDotenv({ path: envLocalPath, override: true });

	const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();
	if (!openRouterApiKey) {
		throw new Error('OPENROUTER_API_KEY is empty in .env.local');
	}

	return {
		openRouterApiKey,
		sttModel: process.env.OPENROUTER_STT_MODEL?.trim() || 'openai/whisper-large-v3',
		extractModel:
			process.env.OPENROUTER_EXTRACT_MODEL?.trim() || 'anthropic/claude-sonnet-4',
		httpReferer: process.env.OPENROUTER_HTTP_REFERER?.trim(),
		appName: process.env.OPENROUTER_APP_NAME?.trim() || 'FunCode Ingest'
	};
}

export function openRouterHeaders(cfg: IngestConfig): Record<string, string> {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${cfg.openRouterApiKey}`,
		'Content-Type': 'application/json'
	};
	if (cfg.httpReferer) headers['HTTP-Referer'] = cfg.httpReferer;
	if (cfg.appName) headers['X-Title'] = cfg.appName;
	return headers;
}
