import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    proxy: {
      // ทุก request /api/* → ส่งไป backend container
      '/api': {
        target: 'http://backend:8080', // ชื่อ service ใน k8s
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // ตัด /api ออก ถ้า backend ไม่มี
      },
    },
  },
});
