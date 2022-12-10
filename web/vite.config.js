import { defineConfig } from 'vite'
import json5 from 'rollup-plugin-json5'

export default defineConfig({
  plugins: [json5({
    test: id => /\.(json|babelrc|json5)$/.test(id),
  })],
})