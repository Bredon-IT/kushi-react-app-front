import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin/',   // ✅ important so app works under /admin
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
