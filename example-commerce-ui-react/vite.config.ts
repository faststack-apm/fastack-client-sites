import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// In dev, /api is proxied to the backend chosen by VITE_API_PROXY_TARGET (Java on 8080 by default).
// In production the nginx container proxies /api instead (see docker/nginx.conf.template).
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const target = env.VITE_API_PROXY_TARGET ?? 'http://localhost:8080';
  return {
    plugins: [react()],
    server: { port: 5173, proxy: { '/api': { target, changeOrigin: true } } },
    preview: { port: 4173, proxy: { '/api': { target, changeOrigin: true } } },
  };
});
