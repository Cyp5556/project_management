import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {},
  },
  optimizeDeps: {
    include: ["yjs", "y-protocols", "y-websocket"]
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
