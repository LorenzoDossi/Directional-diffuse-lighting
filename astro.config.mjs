import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl'

// https://astro.build/config
export default defineConfig({
	compressHTML: true,
	outDir: 'build',
	devToolbar: {
		enabled: false,
	},
	vite: {
	    css: {
	    	devSourcemap: true,
	    },
		plugins: [
			glsl()
		]
	},
});
