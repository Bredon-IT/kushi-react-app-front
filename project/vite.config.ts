import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',   // 👈 build output will work under /customer
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
