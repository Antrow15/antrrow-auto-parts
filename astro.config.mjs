// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.antrrowautoparts.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        if (item.url === 'https://www.antrrowautoparts.com/') {
          item.priority = 1.0;
        } else if (/\/(products|capabilities)\/?$/.test(item.url)) {
          item.priority = 0.9;
        } else if (/request-a-quote|contact/.test(item.url)) {
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
