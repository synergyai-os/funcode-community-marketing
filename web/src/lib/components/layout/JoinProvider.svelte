<script lang="ts">
	import type { Snippet } from 'svelte';
	import { JoinClubModal } from '$lib/components/ui';
	import { captureJoinEmail, setJoinContext } from '$lib/context/join';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	let open = $state(false);
	let intent = $state<string | undefined>();

	setJoinContext({
		get open() {
			return open;
		},
		openJoin: (nextIntent) => {
			intent = nextIntent;
			open = true;
		},
		closeJoin: () => {
			open = false;
			intent = undefined;
		},
		get intent() {
			return intent;
		}
	});

	function onCaptured(email: string) {
		captureJoinEmail(email, intent);
	}
</script>

{@render children()}
<JoinClubModal bind:open captureOnly {onCaptured} {intent} />
