// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
//
// // เรารันใน Docker → ต้องชี้ไปที่ service name ของ backend (ไม่ใช่ localhost)
// export default defineConfig({
//     plugins: [react()],
//     server: {
//         host: true,
//         port: 3000,
//         proxy: {
//             '/api': {
//                 target: 'http://backend:8080',   // <<< ชื่อ service จาก docker-compose
//                 changeOrigin: true,
//                 // backend มี /products (ไม่มี /api) → ตัด /api ออก
//                 rewrite: (p) => p.replace(/^\/api/, ''),
//             },
//         },
//     },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: { host: true, port: 3000, strictPort: true },
});

