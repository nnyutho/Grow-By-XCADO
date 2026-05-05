import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// XGROW Frontend — Vite config
// Used for both local dev (npm run dev) and Vercel build (npm run build).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
  server: {
    port: 5173,
    // For local dev with PHP backend (cd ../ && php -S localhost:8000)
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
