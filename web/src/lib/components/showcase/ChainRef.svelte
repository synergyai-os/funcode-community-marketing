<script lang="ts">
	type Props = {
		chainId: string;
		class?: string;
	};

	let { chainId, class: className = '' }: Props = $props();

	const studioUrl = $derived(`https://gateway.productbrain.io/entries/${chainId}`);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- external Product Brain Studio -->
<a
	href={studioUrl}
	target="_blank"
	rel="noopener noreferrer"
	class={`inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted px-2 py-0.5 font-mono text-xs text-ink-soft transition hover:border-accent hover:text-accent ${className}`}
>
	{chainId}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
