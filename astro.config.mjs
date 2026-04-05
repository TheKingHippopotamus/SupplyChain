import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://thekingHippopotamus.github.io',
  base: '/SupplyChain',
  integrations: [react()],
  prefetch: true,
});
