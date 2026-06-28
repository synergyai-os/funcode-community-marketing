/** Map PAT-7 landingSlot → FunCode personaIds (AUD-1). Mirrors ingest/src/landing-slot-personas.ts */
import type { PersonaId } from './personas.js';

const SLOT_PERSONAS: Record<string, PersonaId[]> = {
	'shift-new': ['founders', 'product-leaders', 'product-managers'],
	'shift-old': ['product-leaders', 'product-managers', 'teams-going-faster'],
	'benefit-playground': ['indie-makers', 'designers-who-build', 'teams-going-faster'],
	'benefit-free': ['indie-makers', 'teams-going-faster'],
	'benefit-build': ['founders', 'indie-makers', 'designers-who-build'],
	'usecase-onboard': ['product-managers', 'indie-makers', 'founders'],
	'usecase-audience': ['product-managers', 'designers-who-build', 'founders'],
	'usecase-ladder': ['product-leaders', 'teams-going-faster'],
	'voice-leaders': ['product-leaders', 'founders']
};

export function personaIdsForLandingSlot(landingSlot: string): PersonaId[] {
	const base = landingSlot.split('|')[0]?.trim() ?? landingSlot;
	return SLOT_PERSONAS[base] ?? ['product-managers', 'founders'];
}

export function landingSlotMatchesPersona(landingSlot: string, personaId: PersonaId): boolean {
	return personaIdsForLandingSlot(landingSlot).includes(personaId);
}
