import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 演示站专用构建配置（用于 Pages 部署）
// 输出标准静态网站，包含 index.html 入口
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-demo',
  },
});
