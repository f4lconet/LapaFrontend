import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), svgr()],
    define: {
      'process.env.VITE_YANDEX_MAPS_API_KEY': JSON.stringify(env.VITE_YANDEX_MAPS_API_KEY)
    },
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
  }
  
})
