<script lang="ts">
	import type { Component } from 'svelte';

	type Props = {
		/** An icon component, e.g. `import IconSparkles from '~icons/lucide/sparkles'`. */
		icon: Component;
		/** Square size in pixels for both width and height. */
		size?: number;
		class?: string;
		'aria-label'?: string;
	};

	let { icon: Glyph, size = 20, class: className = '', ...rest }: Props = $props();
</script>

<Glyph
	width={size}
	height={size}
	class={className}
	aria-hidden={rest['aria-label'] ? undefined : true}
	{...rest}
/>
