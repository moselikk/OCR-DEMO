import fs from 'fs'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    https: {
      cert: fs.readFileSync(path.join(__dirname, 'src/cert/localhost.crt')),
      key: fs.readFileSync(path.join(__dirname, 'src/cert/localhost.key'))
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
