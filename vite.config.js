import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-dnd': ['react-beautiful-dnd'],
          
          // Feature chunks
          'task-management': ['./src/components/TaskItem.jsx', './src/components/KanbanBoard.jsx'],
          'utils': ['./src/utils/dateUtils.js', './src/utils/priorityUtils.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000kb
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
