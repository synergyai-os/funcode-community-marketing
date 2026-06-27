<script lang="ts">
	import AudienceChip from './AudienceChip.svelte';

	type Variant = 'accent' | 'neutral';

	type Props = {
		chipIndex: number;
		emoji: string;
		label: string;
		variant: Variant;
		amplitude: number;
		paused: boolean;
		cta: boolean;
		onJoin?: () => void;
		dragging: boolean;
		suppressClick: boolean;
		poseTransform?: string;
		settling?: boolean;
		isActive?: boolean;
		surfaceClass: 'scatter__drag' | 'cluster__drag';
		onPointerDown: (index: number, event: PointerEvent) => void;
		onPointerMove: (index: number, event: PointerEvent) => void;
		onPointerUp: (index: number, event: PointerEvent) => void;
	};

	let {
		chipIndex,
		emoji,
		label,
		variant,
		amplitude,
		paused,
		cta,
		onJoin,
		dragging,
		suppressClick,
		poseTransform,
		settling = false,
		isActive = false,
		surfaceClass,
		onPointerDown,
		onPointerMove,
		onPointerUp
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={surfaceClass}
	class:is-active={isActive}
	class:is-settling={settling}
	style:transform={poseTransform}
	onpointerdown={(e) => onPointerDown(chipIndex, e)}
	onpointermove={(e) => onPointerMove(chipIndex, e)}
	onpointerup={(e) => onPointerUp(chipIndex, e)}
	onpointercancel={(e) => onPointerUp(chipIndex, e)}
>
	<AudienceChip
		{emoji}
		index={chipIndex}
		{variant}
		{amplitude}
		{paused}
		{cta}
		{onJoin}
		{dragging}
		{suppressClick}
	>
		{label}
	</AudienceChip>
</div>
