<script lang="ts">
	import Badge from './Badge.svelte';
	import type { PredictionStatus } from '$lib/data/timeline';

	type Props = {
		status: PredictionStatus;
		horizon?: string;
	};

	let { status, horizon }: Props = $props();

	const labels: Record<PredictionStatus, string> = {
		open: 'Prediction · open',
		partial: 'Partially true',
		true: 'Came true',
		false: 'Did not hold',
		superseded: 'Superseded',
		untrackable: 'Untrackable'
	};

	const variant = $derived(
		status === 'true'
			? 'accent'
			: status === 'partial'
				? 'solid'
				: status === 'false'
					? 'neutral'
					: 'neutral'
	);
</script>

<Badge {variant} title={horizon ? `Horizon: ${horizon}` : undefined}>
	{labels[status]}{horizon ? ` · ${horizon}` : ''}
</Badge>
