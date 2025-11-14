import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Nx monorepo paths
const root = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/frontend', // NX monorepo cache
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@drug-info/shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
    },
  },
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  preview: {
    port: 4170,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    deps: {
      inline: [/@mui/, /@tanstack/, /date-fns/],
    },
    css: {
      modules: {
        // Vitest + CSS modules compatibility
        scopeBehaviour: 'local', 
      },
    },
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
});
