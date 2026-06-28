<script lang="ts">
	import { onMount } from 'svelte';
	import { initPostHog } from '$lib/analytics/posthog';

	onMount(() => {
		void initPostHog();
	});
</script>
