import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  base: './',
  plugins: [react(), legacy()],
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});
