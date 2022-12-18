import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
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
  plugins: [react(), splitVendorChunkPlugin()],
  assetsInclude: ['**/*.png'],
  
  
})
