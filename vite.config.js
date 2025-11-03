import { defineConfig } from 'vite'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
    cesium()
  ],
  define: {
    'import.meta.env.VITE_CESIUM_ION_TOKEN': JSON.stringify(process.env.VITE_CESIUM_ION_TOKEN)
  },
  optimizeDeps: {
    exclude: [
      'dashboard.html'
    ]
    // Note: Removed cesium, @cesium/engine, mersenne-twister from exclude list
    // vite-plugin-cesium handles CesiumJS bundling automatically
  },
  build: {
   outDir: 'dist',
   assetsDir: 'assets',
   rollupOptions: {
     input: {
       main: './index.html',
       dashboard: './dashboard.html'
     }
   }
 },
  server: {
    port: 5173,
    open: true,
    fs: {
      strict: false
    },
    middlewareMode: false,
    watch: {
      usePolling: false
    }
  },
  preview: {
    port: 4173
  }
})
