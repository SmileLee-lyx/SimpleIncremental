import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfill'

export default defineConfig({
  plugins: [vue(),
    nodePolyfills({
      // 根据需要配置 polyfill
      globals: {
        Buffer: true, // 启用 Buffer polyfill
        global: true, // 启用 global polyfill
        process: true, // 启用 process polyfill
      },
    }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})