import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig(({ mode }) => ({
	// Dev server is pinned and resilient on purpose (INS-31):
	// • port 1234 + strictPort — FunCode always lives at http://localhost:1234, so a
	//   bookmarked tab never points at a dead, auto-incremented port. If 1234 is busy
	//   the start fails loudly (kill the stale process) instead of silently moving.
	// • watch.usePolling — this repo lives in a Dropbox-synced folder, where native
	//   fsevents are unreliable and edits often don't trigger HMR. Polling makes saves
	//   render instantly without a manual restart. Slight CPU cost, worth it here.
	server: {
		port: 1234,
		strictPort: true,
		watch: { usePolling: true, interval: 100 }
	},
	preview: { port: 1234, strictPort: true },
	plugins: [
		tailwindcss(),
		Icons({ compiler: 'svelte' }),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Node server output (build/) so the app runs on Railway via `node build`.
			// `adapter` is a SvelteKit kit option; passed at the top level here it is
			// routed to `kit.adapter` (see @sveltejs/kit split_config).
			adapter: adapter()
		}),
		// Resolves the browser Svelte build so components mount client-side under jsdom.
		// Gated to test mode so it never affects the production build.
		...(mode === 'test' ? [svelteTesting()] : [])
	],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest-setup.ts']
	}
}));
