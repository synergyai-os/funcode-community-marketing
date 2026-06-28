import { error } from '@sveltejs/kit';
import { quotesForTool, toolBySlug, type ToolQuote, type WorkflowTool } from '$lib/data/media';

export function load({ params }: { params: { slug: string } }): {
	tool: WorkflowTool;
	quotes: ToolQuote[];
} {
	const tool = toolBySlug(params.slug);
	if (!tool) error(404, 'Tool not found');
	return { tool, quotes: quotesForTool(params.slug) };
}
