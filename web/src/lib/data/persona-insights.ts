import type { PersonaId } from './personas.js';
import { landingSlotMatchesPersona } from './landing-slot-personas.js';
import { lennyBatch } from './showcase/lenny-batch.generated.js';
import type { ShowcaseInsight } from './showcase/types.js';

function allInsights(): ShowcaseInsight[] {
	return lennyBatch.allInsights;
}

/** Learnings in the new lane for this persona (shift-new + benefit-* slots). */
export function newLaneForPersona(personaId: PersonaId, limit = 3): ShowcaseInsight[] {
	return allInsights()
		.filter(
			(i) => landingSlotMatchesPersona(i.landingSlot, personaId) && i.landingSlot !== 'shift-old'
		)
		.slice(0, limit);
}

/** shift-old learnings this persona is leaving behind. */
export function shiftOldForPersona(personaId: PersonaId, limit = 2): ShowcaseInsight[] {
	return lennyBatch.shiftOld
		.filter((i) => landingSlotMatchesPersona(i.landingSlot, personaId))
		.slice(0, limit);
}

export function personaHasIngestInsights(personaId: PersonaId): boolean {
	return allInsights().some((i) => landingSlotMatchesPersona(i.landingSlot, personaId));
}

/** Homepage teaser — one contrasting pair with broad appeal. */
export function homepageShiftPair(): { old: ShowcaseInsight; neu: ShowcaseInsight } | null {
	const neu = lennyBatch.shiftNew.find((i) => i.title.includes('AI')) ?? lennyBatch.shiftNew[0];
	const old =
		lennyBatch.shiftOld.find((i) => /roadmap|customer|PM|design process/i.test(i.title)) ??
		lennyBatch.shiftOld[0];
	if (!neu || !old) return null;
	return { old, neu };
}

/** @deprecated Use newLaneForPersona */
export const shiftNewForPersona = newLaneForPersona;
