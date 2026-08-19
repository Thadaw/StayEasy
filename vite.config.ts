import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],

  server: {
    port: 5173,
    strictPort: true,

    proxy: {
      '/api': {
        target: 'https://stay-easy-sizw.onrender.com',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const origin = req.headers.origin
            if (origin) {
              proxyReq.setHeader('Origin', origin)
            }
          })
        },
      },
    },
  },
})