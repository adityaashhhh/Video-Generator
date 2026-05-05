import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force Vite to open Opera GX
process.env.BROWSER = 'C:\\Users\\notad\\AppData\\Local\\Programs\\Opera GX\\opera.exe';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  }
})
