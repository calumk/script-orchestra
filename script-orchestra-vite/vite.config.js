import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from 'unplugin-vue-components/resolvers';
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    }),
    viteSingleFile(),
    // {
    //   name: 'renameIndex',
    //   enforce: 'post',
    //   generateBundle(options, bundle) {
    //     const indexHtml = bundle['index.html']
    //     indexHtml.fileName = 'index.txt'
    // }}
  ]
})