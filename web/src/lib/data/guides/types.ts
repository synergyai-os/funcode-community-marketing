export type GuideStatus = 'interactive' | 'placeholder';

export type GuideStep = {
	order: number;
	title: string;
	body: string;
};

export type Guide = {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	duration: string;
	status: GuideStatus;
	steps: GuideStep[];
	chainRefs: string[];
};
