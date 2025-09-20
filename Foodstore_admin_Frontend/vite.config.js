import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // bind 0.0.0.0 ให้เข้าจาก host ได้
    port: 3001,
    strictPort: true
  },
});
