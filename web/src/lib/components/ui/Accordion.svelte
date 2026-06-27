<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import IconChevronDown from '~icons/lucide/chevron-down';

	// Native <details>/<summary>: keyboard- and screen-reader-accessible with no JS.
	type Props = HTMLAttributes<HTMLDetailsElement> & {
		/** The always-visible question shown in the summary row. */
		question: string;
		children: Snippet;
	};

	let { question, class: className = '', children, ...rest }: Props = $props();
</script>

<details class={`border-b border-border ${className}`} {...rest}>
	<summary
		class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-ink transition hover:text-accent-strong focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
	>
		{question}
		<IconChevronDown class="accordion-chevron size-5 shrink-0 text-ink-soft transition-transform" />
	</summary>
	<div class="pb-5 text-ink-soft">{@render children()}</div>
</details>

<style>
	details[open] :global(.accordion-chevron) {
		transform: rotate(180deg);
	}
</style>
