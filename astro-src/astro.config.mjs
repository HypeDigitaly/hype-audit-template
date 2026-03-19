// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  devToolbar: {
    enabled: false
  },
  build: {
    inlineStylesheets: 'always', // Inline all CSS for maximum performance (eliminates render-blocking CSS)
    assets: '_astro' // Consistent asset path for caching
  },
  compressHTML: true, // Minify HTML output
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true, // Enable CSS code splitting
      minify: 'esbuild', // Use esbuild for faster minification
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code for better caching
            'cookie-consent': ['./src/scripts/cookie-consent.ts'],
          }
        }
      }
    }
  }
});