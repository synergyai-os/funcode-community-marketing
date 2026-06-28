import { communityGenerated } from './generated';
import type { Collection, Label, Program, ShareGrant } from './types';

export type { AgentSnippet, Collection, Label, Program, ProgramKind, ShareGrant } from './types';
export { communityGenerated };

export function labels(): readonly Label[] {
	return communityGenerated.labels;
}

export function labelBySlug(slug: string): Label | undefined {
	return communityGenerated.labels.find((l) => l.slug === slug);
}

export function collections(): readonly Collection[] {
	return communityGenerated.collections;
}

export function collectionBySlug(slug: string): Collection | undefined {
	return communityGenerated.collections.find((c) => c.slug === slug);
}

export function programs(): readonly Program[] {
	return communityGenerated.programs;
}

export function programBySlug(slug: string): Program | undefined {
	return communityGenerated.programs.find((p) => p.slug === slug);
}

export function programsByKind(kind: Program['kind']): Program[] {
	return communityGenerated.programs.filter((p) => p.kind === kind);
}

export function shareGrantByToken(token: string): ShareGrant | undefined {
	return communityGenerated.shareGrants.find((g) => g.token === token);
}

export function resolveCollectionLabels(collection: Collection): Label[] {
	return collection.labelSlugs
		.map((slug) => labelBySlug(slug))
		.filter((l): l is Label => l !== undefined);
}
