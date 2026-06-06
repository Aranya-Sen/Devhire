import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-redirects',
      closeBundle() {
        fs.writeFileSync(
          resolve(__dirname, 'dist/_redirects'),
          '/*    /index.html    200\n'
        )
      }
    }
  ],
  build: {
    outDir: 'dist',
    copyPublicDir: true
  }
})