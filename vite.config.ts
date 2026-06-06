import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  server: {
    host: '127.0.0.1', // Force IPv4 to avoid EACCES on ::1
    port: 3000,      // Use port 3000 (5173 has permission issues)
  },
  plugins: [
    react(),
    // 运行 `npm run build` 后自动生成 dist/visualizer/index.html
    ...(process.env.VISUALIZE === 'true' ? [visualizer({ open: true, filename: 'dist/visualizer/stats.html', gzipSize: true })] : []),
    dts({
      include: ['src/lib', 'src/components'],
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/lib/index.ts',
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
