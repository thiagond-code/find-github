// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  env: {
    schema: {
      GITHUB_API_PAT: envField.string({ context: 'server', access: 'secret' })
    }
  }
});