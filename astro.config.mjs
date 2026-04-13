import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://geo.prvni-pozice.com',
  integrations: [],
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always',
  },
});
