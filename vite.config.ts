import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        // Android optimization: Smaller chunks for better loading
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion'],
          'vendor-i18n': ['react-i18next', 'i18next'],
        },
        // Optimize for mobile devices
        chunkSizeWarningLimit: 500,
      },
    },
    // Android optimization: Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    // Optimize chunk size for mobile
    chunkSizeWarningLimit: 500,
    // Enable source maps only in development
    sourcemap: !process.env.PROD,
  },
  ssr: {
    noExternal: ['react-router-dom'],
  },
  server: {
    host: '0.0.0.0', // Allow external connections (for mobile device testing)
    port: 5173,
    proxy: {
      '/api/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nominatim/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add required headers for Nominatim
            proxyReq.setHeader('User-Agent', 'Givea-Donation-App/1.0 (https://www.givea.shop)');
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
          });
        },
      },
    },
  },
  // Service worker is automatically copied from public/ to dist/ during build
  // The service worker registration happens in main.tsx for production builds
});
