import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@hello-pangea/dnd': '@hello-pangea/dnd/dist/react-beautiful-dnd'
    }
  }
})
