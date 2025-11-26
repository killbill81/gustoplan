const { resolve } = require('path');
const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;

module.exports = defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
  },
});
