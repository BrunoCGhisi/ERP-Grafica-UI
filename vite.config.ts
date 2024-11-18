import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: false, // Desativa o SSL
  },
  optimizeDeps: {
    include: ['@mui/material/Tooltip', '@emotion/styled'],
  },
});