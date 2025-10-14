// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ hard-code API URL สำหรับ production
const API_BASE = process.env.NODE_ENV === 'production'
  ? '/api'        // ให้ nginx proxy /api ไป backend ใน cluster
  : 'http://localhost:8080'  // สำหรับ dev local

export default defineConfig({
  plugins: [react()],
  define: { 'process.env': {} },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: API_BASE,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
})
