import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, existsSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-cname',
      closeBundle() {
        if (existsSync('CNAME')) {
          copyFileSync('CNAME', 'dist/CNAME')
        }
        // Ensure .nojekyll is copied
        if (existsSync('public/.nojekyll')) {
          copyFileSync('public/.nojekyll', 'dist/.nojekyll')
        }
      }
    },
    {
      name: 'remove-crossorigin',
      transformIndexHtml(html) {
        // Remove crossorigin attribute which can cause MIME type issues on GitHub Pages
        return html.replace(/\s+crossorigin/g, '')
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Ensure proper file extensions
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})

