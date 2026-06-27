import type { PersonaId } from './personas.js';

/** Persona landing highlights — grounded in AUD-1 + voice themes (not fabricated proof). */
export type PersonaContent = {
	/** Short bullets for the persona page — what builders in this lane care about. */
	highlights: string[];
};

export const personaContent: Record<PersonaId, PersonaContent> = {
	'product-managers': {
		highlights: [
			'Ship prototypes instead of polishing slide decks — with agents that remember your decisions.',
			'Verification beats raw codegen when everyone can spin up a PR in minutes.',
			'Intent clarity beats prompt tricks when you steer the build.'
		]
	},
	'product-leaders': {
		highlights: [
			'Radical uncertainty is the honest frame — then you engage and build intuition.',
			'Strategic bets still need humble starts, not hope dressed as a roadmap.',
			'Leaders operating in public share how they ride the model curve, not magic formulas.'
		]
	},
	'designers-who-build': {
		highlights: [
			'Freedom to cook — room to experiment instead of following a rigid recipe.',
			'Play Rooms let you try UI in the open without a permission gate.',
			'Build with AI means you own the prototype, not just the Figma file.'
		]
	},
	founders: {
		highlights: [
			'Burn the resume when ambition means defining innovation for your customer, not your peers.',
			'Small humble starts beat over-ambitious launches — prove, then expand.',
			'Everything is possible in theory; now it is about how ambitious you dare to be.'
		]
	},
	'indie-makers': {
		highlights: [
			'Make new mistakes — learning beats repeating the same safe failure.',
			'Internet-scale ambition starts with something you cannot remember life before.',
			'Build in public with attribution and source links, not fabricated social proof.'
		]
	},
	'agent-curious-engineers': {
		highlights: [
			'Trust but verify — let agents run, then check the work like a junior teammate.',
			"Ride the models — stay on the capability curve instead of freezing on yesterday's stack.",
			'Forward-deployed engineer: someone whose job is making the company agent work for everyone.'
		]
	},
	'teams-going-faster': {
		highlights: [
			'Lean into fear by asking what is in your control — then move.',
			'Teams going faster still need Play Rooms, not PR-as-verdict culture.',
			'When something is hard, relate from strength and spaciousness — not panic.'
		]
	}
};

export function contentForPersona(id: PersonaId): PersonaContent {
	return personaContent[id];
}
