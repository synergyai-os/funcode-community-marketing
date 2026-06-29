<script lang="ts">
	import { SiteChrome } from '$lib/components/ui';

	type Props = {
		homeAnchors?: boolean;
	};

	let { homeAnchors = false }: Props = $props();
</script>

<SiteChrome {homeAnchors} />
