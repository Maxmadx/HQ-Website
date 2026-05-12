import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Read GIT_REV from the build shell env; default to 'unknown' if absent.
    // The build script in package.json sets this from `git rev-parse --short HEAD`.
    'import.meta.env.VITE_GIT_REV': JSON.stringify(process.env.GIT_REV || 'unknown'),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7500',
        changeOrigin: true,
      },
    },
  },
  test: {
    setupFiles: ['./api/test-setup.js', './src/test-setup.js'],
    exclude: ['**/node_modules/**', '**/.worktrees/**', 'firestore-rules.test.js'],
  },
})
