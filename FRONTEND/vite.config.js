import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'esbuild',
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
})
