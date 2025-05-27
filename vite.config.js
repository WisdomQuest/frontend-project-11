import { resolve } from 'path';

export default {
  root: resolve(__dirname, 'src'),
  build: {
    outDir: '../dist',
  },
  server: {
    port: 8080,
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
};

// const path = require('path');

// export default {
//   root: path.resolve(__dirname, 'src'),
//   resolve: {
//     alias: {
//       '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
//     },
//   },
//   server: {
//     port: 8080,
//     hot: true,
//   },
// };
