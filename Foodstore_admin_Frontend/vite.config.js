import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || '/api' // fallback เป็น /api ที่ nginx จะ proxy ให้

  return defineConfig({
    plugins: [react()],
    define: { 'process.env': {} },
    server: {
      host: true,
      port: 3001,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    envPrefix: 'VITE_',
  })
}
