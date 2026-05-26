// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  env: {
    schema: {
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret' })
    }
  },

  adapter: vercel()
});