import { error } from '@sveltejs/kit';
import { isPersonaId, personaBySlug, type Persona } from '$lib/data/personas';

export function load({ params }: { params: { persona: string } }): { persona: Persona } {
	const persona = personaBySlug(params.persona);
	if (!persona || !isPersonaId(params.persona)) {
		error(404, 'Persona not found');
	}
	return { persona };
}
