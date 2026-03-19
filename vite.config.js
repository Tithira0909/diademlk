import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'editorjs-vendor': ['@editorjs/editorjs', '@editorjs/header', '@editorjs/list', '@editorjs/image', 'editorjs-html', '@editorjs/paragraph', 'editorjs-text-alignment-blocktune'],
          'mantine-vendor': ['@mantine/core', '@mantine/hooks'],

          'recharts-vendor': ['recharts'],
          'three-vendor': ['three']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Raise limit slightly as some vendor chunks might still be large but separate
  }
})
