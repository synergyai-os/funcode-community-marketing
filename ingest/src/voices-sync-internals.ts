import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { VoicesRegistry } from './voices-sync.js';

export function registryPath(repoRoot: string): string {
	return join(repoRoot, '.ingest', 'voices-registry.json');
}

export function loadRegistry(repoRoot: string): VoicesRegistry {
	const path = registryPath(repoRoot);
	if (!existsSync(path)) {
		return { updatedAt: new Date().toISOString(), candidates: [] };
	}
	return JSON.parse(readFileSync(path, 'utf8')) as VoicesRegistry;
}

export function readExistingChainIds(voicesTsPath: string): Set<string> {
	if (!existsSync(voicesTsPath)) return new Set();
	const src = readFileSync(voicesTsPath, 'utf8');
	const ids = [...src.matchAll(/chainId:\s*'([^']+)'/g)].map((m) => m[1]!);
	return new Set(ids);
}
