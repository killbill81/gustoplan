import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/gustoplan/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
});
