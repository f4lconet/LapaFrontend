import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': './src' } },
  css: { preprocessorOptions: { scss: { additionalData: `` } } },
  server: { 
    port: 3000,
  },
  build: { 
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  }
})
