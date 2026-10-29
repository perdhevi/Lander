import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      // Two page entries: the home page and the Collection (served at /collection/).
      input: {
        main: resolve(__dirname, 'index.html'),
        collection: resolve(__dirname, 'collection/index.html'),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("jsm")) {
              return "vendor_three_jsm";
            }
            if (id.includes("three")) {
                  return "vendor_three";
            }
            return "vendor"; // all other package goes here
          }
          },
      },
    },
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    {
      // Dev only: serve standalone Collection pages (public/collection/<slug>/index.html) at /collection/<slug>/.
      // Without this the dev server falls back to the home page. Production hosting already does this.
      name: 'collection-subpage-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && /^\/collection\/[^/?#]+\/(\?.*)?$/.test(req.url)) {
            req.url = req.url.replace(/\/(\?|$)/, '/index.html$1');
          }
          next();
        });
      },
    },
  ],
  assetsInclude: ['**/*.png'],
  
  
})
