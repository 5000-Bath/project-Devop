// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // โหลด .env ตาม mode (แต่ใช้แค่ใน dev)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],

    define: {
      'process.env': {}, // ป้องกัน error จากไลบรารีเก่า
    },

    server: {
      host: true,
      port: 3001,
      strictPort: true,

      // ✅ Proxy ใช้ได้เฉพาะในโหมด development เท่านั้น
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          // ไม่ต้อง rewrite เพราะ backend ของคุณรับ /api อยู่แล้ว
          // หาก backend รับที่ root (/products) → ให้ใช้ rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
    },

    // ป้องกันการ expose env ที่ไม่ขึ้นต้นด้วย VITE_
    envPrefix: 'VITE_',
  });
};
