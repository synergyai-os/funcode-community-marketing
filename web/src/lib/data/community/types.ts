export type ProgramKind =
	| 'event'
	| 'meetup'
	| 'cohort'
	| 'workshop'
	| 'private_session'
	| 'training'
	| 'guide';

export type ProgramTier = 'free' | 'premium';
export type ProgramVisibility = 'public' | 'team' | 'org' | 'private';
export type ShareAudience = 'public' | 'link' | 'team' | 'org';

export type Label = {
	slug: string;
	name: string;
	gloRef: string | null;
	description: string;
};

export type Collection = {
	slug: string;
	name: string;
	description: string;
	labelSlugs: string[];
	chainRefs: string[];
};

export type ShareGrant = {
	token: string;
	collectionSlug: string;
	title: string;
	audience: ShareAudience;
	expiresAt: string | null;
	maxViews: number | null;
	maxActions: Record<string, number> | null;
};

export type Program = {
	slug: string;
	kind: ProgramKind;
	tier: ProgramTier;
	visibility: ProgramVisibility;
	title: string;
	tagline: string;
	description: string;
	labelSlugs: string[];
	chainRefs: string[];
	duration: string;
	schedule?: { starts: string; ends: string };
};

export type AgentSnippet = {
	id: string;
	source: 'media' | 'showcase' | 'chain';
	title: string;
	guest: string;
	text: string;
};

export type CommunityManifest = {
	labels: Label[];
	collections: Collection[];
	shareGrants: ShareGrant[];
	programs: Program[];
	agentSnippets: AgentSnippet[];
};
