import { timelineGenerated } from './generated';
import type { PersonaId } from '$lib/data/personas';
import type { TimelineEvent } from './types';

export type {
	ClaimKind,
	ConvergenceRow,
	PredictionStatus,
	SpeakerRecord,
	TimelineEvent,
	TimelineEventKind,
	TimelineManifest
} from './types';
export { timelineGenerated };

export function eventById(id: string): TimelineEvent | undefined {
	return timelineGenerated.events.find((e) => e.id === id);
}

export function eventsForYear(year: number): TimelineEvent[] {
	return timelineGenerated.events.filter((e) => e.year === year);
}

export function eventsForPersona(personaId: PersonaId): TimelineEvent[] {
	return timelineGenerated.events.filter(
		(e) => e.kind !== 'episode' && (e.personaIds as readonly string[]).includes(personaId)
	);
}

export function predictionsForPersona(personaId: PersonaId): TimelineEvent[] {
	return eventsForPersona(personaId).filter((e) => e.kind === 'prediction');
}

export function beliefsForYear(year: number): TimelineEvent[] {
	const byYear = timelineGenerated.beliefsByYear as Record<string, readonly string[]>;
	const ids = new Set(byYear[String(year)] ?? []);
	return timelineGenerated.events.filter((e) => ids.has(e.id));
}

export function sortedYears(): number[] {
	return [...timelineGenerated.years];
}
