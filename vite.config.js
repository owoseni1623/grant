import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000, // You can specify a specific port or remove this line to use the default
    proxy: {
      '/api': {
        target: 'https://grant-api.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});