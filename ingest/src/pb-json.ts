import { execPb } from './pb-exec.js';

export type PbEntry = {
	entryId?: string;
	name?: string;
	sourceRef?: string;
	collectionSlug?: string;
	relations?: Array<{
		otherEntryId?: string;
		direction?: string;
		type?: string;
	}>;
	error?: string;
};

export type PbWhoami = {
	workspace?: string;
	profile?: string;
};

export function pbGetEntry(id: string): PbEntry {
	const out = execPb(['--json', 'get', id]);
	const parsed = JSON.parse(out) as PbEntry;
	if (parsed.error) throw new Error(String(parsed.error));
	if (parsed.entryId !== id) {
		throw new Error(`pb get ${id} returned unexpected entryId ${parsed.entryId ?? 'none'}`);
	}
	return parsed;
}

export function pbWhoami(): PbWhoami {
	const out = execPb(['--json', 'whoami']);
	return JSON.parse(out) as PbWhoami;
}

export function entryRelatesTo(entry: PbEntry, targetId: string): boolean {
	return (entry.relations ?? []).some((r) => r.otherEntryId === targetId);
}
