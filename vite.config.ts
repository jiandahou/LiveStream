import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // 监听所有网络接口
    port: 5173,       // 你可以选择任何端口
    open: true         // 默认打开浏览器
  },
  plugins: [react()],
})
