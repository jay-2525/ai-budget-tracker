import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 12000,
    strictPort: true,
    allowedHosts: ['work-1-caougmcvpgjobbdu.prod-runtime.all-hands.dev'],
    cors: true,
  },
})
