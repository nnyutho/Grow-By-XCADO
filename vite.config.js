import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Grow by XCADO — Vite config
// Used for both local dev (npm run dev) and Vercel build (npm run build).
// VitePWA generates the service worker + manifest so the app installs on
// phones from a browser ("Add to Home Screen" / Chrome install prompt).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'xcado-logo.png', 'xcado-logo-mark.png'],
      manifest: {
        name: 'Grow by XCADO',
        short_name: 'Grow',
        description: 'Farmer-side platform of the XCADO Group ecosystem. Grow. Further.',
        theme_color: '#0F3D20',
        background_color: '#F5F1E8',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/xcado-logo.png',      sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/xcado-logo.png',      sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/xcado-logo-mark.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        categories: ['agriculture', 'business', 'productivity'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
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
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
