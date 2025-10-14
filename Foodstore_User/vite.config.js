import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:8080' // ใช้ backend IP/port

  return defineConfig({
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: apiUrl,       // ทุก request /api จะส่งไป backend
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: { 'process.env': {} },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    envPrefix: 'VITE_',
  })
}
