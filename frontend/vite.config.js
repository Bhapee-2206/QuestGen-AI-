import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/generate': 'http://localhost:8000',
      '/papers': 'http://localhost:8000',
      '/api': 'http://localhost:8000',
    }
  }
})
