// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://tripinary-one.vercel.app/'
    }
  },
  build: {
    outDir: 'build',
  },
});
