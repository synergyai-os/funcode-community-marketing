<script lang="ts">
	import { resolve } from '$app/paths';
	import { learnNavLinks, learnNavSecondary } from '$lib/data/learn-nav';

	const year = new Date().getFullYear();
	const allLinks = [...learnNavLinks, ...learnNavSecondary];
</script>

<footer class="border-t border-border">
	<div class="mx-auto max-w-6xl px-6 py-10">
		<nav
			class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink-soft"
			aria-label="Learn"
		>
			{#each allLinks as link (link.href)}
				<a class="transition hover:text-accent" href={resolve(link.href)}>{link.label}</a>
			{/each}
		</nav>
		<div
			class="mt-6 flex flex-col items-center justify-between gap-2 text-sm text-muted sm:flex-row"
		>
			<p>© {year} FunCode. Everyone can create.</p>
			<p>Built with SvelteKit + Tailwind.</p>
		</div>
	</div>
</footer>
