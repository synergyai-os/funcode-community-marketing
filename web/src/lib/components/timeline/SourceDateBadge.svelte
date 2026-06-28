<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import { formatSourceDate } from '$lib/utils/format-date';

	type Props = {
		sourcePublishedAt: string | null | undefined;
		ingestedAt?: string | null;
		/** compact = year only on dense cards */
		compact?: boolean;
	};

	let { sourcePublishedAt, ingestedAt, compact = false }: Props = $props();

	const sourceLabel = $derived(formatSourceDate(sourcePublishedAt));
	const ingestLabel = $derived(formatSourceDate(ingestedAt));
</script>

{#if sourceLabel}
	<Badge variant="neutral" title="Original source publication date">
		{compact ? new Date(sourcePublishedAt!).getUTCFullYear() : `Source · ${sourceLabel}`}
	</Badge>
{:else if ingestLabel}
	<Badge variant="neutral" title="Ingested to FunCode (source date unknown)">
		Ingested · {compact ? new Date(ingestedAt!).getUTCFullYear() : ingestLabel}
	</Badge>
{/if}
