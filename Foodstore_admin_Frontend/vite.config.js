// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // โหลด env ของ Vite ตาม mode
  const env = loadEnv(mode, process.cwd(), '')

  // สำหรับ dev → ชี้ไป backend service ใน docker/K8s หรือ localhost
  // สำหรับ production → ใช้ relative path /api ให้ Nginx proxy ให้
  const API_BASE = mode === 'development'
    ? (env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '')
    : '/api'

  return defineConfig({
    plugins: [react()],
    define: {
      'process.env': {} // ป้องกัน error จาก process.env
    },
    server: {
      host: true,
      port: 3001,
      strictPort: true,
      // **proxy ใช้เฉพาะ dev**
      proxy: mode === 'development'
        ? {
            '/api': {
              target: API_BASE,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    envPrefix: 'VITE_',
  })
}
