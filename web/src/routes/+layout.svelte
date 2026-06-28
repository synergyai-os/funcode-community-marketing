<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import PostHogInit from '$lib/components/analytics/PostHogInit.svelte';
	import JoinProvider from '$lib/components/layout/JoinProvider.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<PostHogInit />
<JoinProvider>
	{@render children()}
</JoinProvider>
