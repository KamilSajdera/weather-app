import { defineConfig } from "vite";

export default defineConfig({
  base: '/weather-app/',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    exclude: ['lottie-web']
  }
})