import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use static adapter for GitHub Pages
		adapter: adapter({
			// GitHub Pages uses the `docs` directory for publishing
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		}),
		// Set the path prefix for GitHub Pages (your-username.github.io/repo-name)
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/mastermind-pwa' : ''
		}
	},
	
};

export default config;
