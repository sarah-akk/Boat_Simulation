import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  root: "./src",
  publicDir: "../static",
});


