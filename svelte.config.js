import adapterNode from '@sveltejs/adapter-node';
// import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// const adapter = process.env.APP_ENVIRONMENT === 'production' ? adapterVercel() : adapterNode();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapterNode({
			 bodySize: '10mb'
		}),
		paths: {
			relative: false // Required for PostHog session replay to work correctly
		}
	}
};

export default config;
