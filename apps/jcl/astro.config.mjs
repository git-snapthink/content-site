// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [mdx()],
  site: 'https://jasonclewis.com',
  build: { inlineStylesheets: 'auto' },
  vite: { build: { cssMinify: true } },
  redirects: {
    '/articles': '/insights',
    '/articles/[slug]': '/insights/[slug]',
    '/jcl': '/',
  },
});
