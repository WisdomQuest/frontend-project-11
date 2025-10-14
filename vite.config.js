import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default {
  root: resolve(__dirname),
  build: {
    outDir: '../dist',
  },
  server: {
    port: 8080,
    hot: true,
    watch: {
      usePolling: true,
    },
    hmr: true,
  },
  // Optional: Silence Sass deprecation warnings. See note below.
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'import',
          'mixed-decls',
          'color-functions',
          'global-builtin',
        ],
      },
    },
  },
}
