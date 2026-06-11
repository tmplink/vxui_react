import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

// 检测是否为页面部署构建（通过环境变量或参数）
const isPageBuild = process.env.PAGE_BUILD === 'true';

export default defineConfig({
  // 基础路径：页面部署使用相对路径，确保 SPA 路由正常工作
  // 开发环境和普通构建使用 '/'（Vite 默认值）
  base: isPageBuild ? './' : '/',
  
  server: {
    host: '127.0.0.1', // Force IPv4 to avoid EACCES on ::1
    port: 5173,      // Port 3000 is in Windows excluded range (2957-3056)
    strictPort: false, // Auto-switch to next available port if occupied
  },
  plugins: [
    react(),
    // 运行 `npm run build` 后自动生成 dist/visualizer/index.html
    ...(process.env.VISUALIZE === 'true' ? [visualizer({ open: true, filename: 'dist/visualizer/stats.html', gzipSize: true })] : []),
    ...(isPageBuild ? [] : [
      dts({
        include: ['src/lib', 'src/components'],
        insertTypesEntry: true,
        copyDtsFiles: true,
      }),
    ]),
  ],
  build: {
    target: 'es2015',
    minify: true,
    cssCodeSplit: true,
    ...(isPageBuild ? {
      // 页面部署模式：构建完整应用
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          dir: 'dist',
          format: 'es',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    } : {
      // 库模式：仅构建组件库
      lib: {
        entry: resolve(__dirname, 'src/lib/index.ts'),
        name: 'VXUIReact',
        formats: ['es', 'cjs'],
        fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    }),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/hooks/**/*.ts',
        'src/lib/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/components/pages/**',
        'src/components/mobile/MobileApp.tsx',
        'src/components/mobile/MobilePreviewPage.tsx',
        'src/components/mobile/MobileShell.tsx',
        'src/components/AppShell.tsx',
        'src/components/Shell.tsx',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
