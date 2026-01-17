import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 构建输出目录
    outDir: 'dist',
    // 生成source map（生产环境可以关闭以减小体积）
    sourcemap: false,
    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    // 构建后是否生成 manifest.json
    manifest: false,
    // 设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器
    minify: 'esbuild',
    // chunk 大小警告的限制
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 用于从入口点创建的块的打包输出格式
        format: 'es',
        // 自定义chunk文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  // 根据环境变量设置 base 路径
  // 如果设置了 VITE_BASE_PATH 环境变量，使用该值；否则根据部署目标设置
  // GitHub Pages 使用 /Workout-Pal/，阿里云 OSS 使用 /
  base: process.env.VITE_BASE_PATH || (process.env.DEPLOY_TARGET === 'oss' ? '/' : '/Workout-Pal/'),
})




