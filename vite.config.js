
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: '/index.html'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@nhost/react',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'react-hot-toast',
      'jspdf'
    ]
  },
  server: {
  proxy: {
    '/webhook': {
      target: 'https://sau163.app.n8n.cloud',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/webhook/, '')
    }
  }
}

});
