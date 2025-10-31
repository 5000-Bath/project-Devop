import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// import { fileURLToPath } from 'url'; // ไม่จำเป็นต้องใช้ถ้าใช้ path.resolve 

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:8080'

  // Path ของ node_modules บนระบบไฟล์ (Jenkins Agent Host)
  const nodeModulesDir = path.resolve(__dirname, 'node_modules');

  return defineConfig({
    plugins: [react()],

    resolve: {
      alias: [
        {
          // *** MSW Fix: ใช้ Alias เพื่อให้ Vitest หา 'msw/node' ได้ถูกต้อง ***
          find: 'msw/node',
          // ชี้ไปที่ไฟล์หลักของ msw/node 
          replacement: path.resolve(nodeModulesDir, 'msw/lib/node/index.js'),
        },
        {
          // Alias สำหรับ Source Code
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },

    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: apiUrl,
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