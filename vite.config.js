import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',
  plugins: [vue()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  root: "./src",
  publicDir: "../static",
  build: {
    outDir: 'dist',
    assetsDir: 'assets',

  },
});


