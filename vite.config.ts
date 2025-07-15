import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// Optimize bundle size
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		// Split chunks for better caching
		rollupOptions: {
			output: {
				manualChunks: {
					svelte: ['svelte'],
					game: ['$lib/utils/gameLogic.ts', '$lib/utils/colors.ts'],
					store: ['$lib/stores/gameStore.ts']
				}
			}
		},
		// Generate source maps for production
		sourcemap: true
	},
	// Optimize dev server
	server: {
		fs: {
			strict: true
		}
	},
	// Configure Vitest
	test: {
		globals: true
	}
});
