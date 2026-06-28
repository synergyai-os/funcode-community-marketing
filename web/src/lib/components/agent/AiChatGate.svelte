<script lang="ts">
	import { onMount } from 'svelte';
	import { isFeatureEnabled } from '$lib/analytics/feature-flags';
	import AiChatShell from '$lib/components/agent/AiChatShell.svelte';
	import type { ChatContext } from '$lib/agent/mock-agent';

	type Props = { context: ChatContext };

	let { context }: Props = $props();
	let enabled = $state(false);

	onMount(() => {
		enabled = isFeatureEnabled('premium-ai-chat');
	});
</script>

{#if enabled}
	<AiChatShell {context} />
{/if}
