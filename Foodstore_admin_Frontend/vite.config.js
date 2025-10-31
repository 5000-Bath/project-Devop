import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // *** ต้อง import path ***

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:8080';

  const nodeModulesDir = path.resolve(__dirname, 'node_modules');

  return defineConfig({
    plugins: [react()],

    define: {
      'process.env': {},
    },

    // *** เพิ่มส่วน RESOLVE สำหรับ Alias ***
    resolve: {
      alias: [
        {
          // MSW Fix
          find: 'msw/node',
          replacement: path.resolve(nodeModulesDir, 'msw/lib/node/index.js'),
        },
        {
          // Alias สำหรับ Source Code (ถ้าใช้ @/ ในโค้ด)
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },
    // **********************************

    server: {
      host: true,
      port: 3001, // Admin Port
      strictPort: true,

      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/login': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/check': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/logout': {
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


    build: {
      outDir: 'dist',
      sourcemap: false,
    },

    envPrefix: 'VITE_',
  });
};