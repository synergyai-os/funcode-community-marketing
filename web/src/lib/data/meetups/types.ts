export type AgendaItem = {
	/** Display order */
	order: number;
	title: string;
	description: string;
	durationMinutes: number;
	/** Link to an interactive guide, when applicable */
	guideSlug?: string;
};

export type MeetupStatus = 'scheduled' | 'open-slot' | 'past';

export type MeetupEvent = {
	slug: string;
	status: MeetupStatus;
	title: string;
	tagline: string;
	description: string;
	/** ISO date when known */
	startsAt: string | null;
	/** Human label when date not fixed yet */
	dateLabel: string;
	durationMinutes: number;
	location: {
		city: string;
		region?: string;
		country: string;
		venue?: string;
	};
	organizer: string;
	organizerNote: string;
	audience: string;
	agenda: AgendaItem[];
	chainRefs: string[];
};
