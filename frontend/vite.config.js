import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}

  return defineConfig({
    server: {
      port: process.env.VITE_PORT || 7777,
      proxy: {
        '/api': process.env.VITE_API_BASE
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: false
          })
        ]
      })
    ],
    test: {
      include: ['**/__tests__/**/*.spec.[tj]s'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**'
      ],
      testTimeout: 20000,
      environment: 'jsdom',
      env: {
        DEFAULT_LANG: 'zh'
      },
      coverage: {
        reportsDirectory: './__tests__/unit/coverage',
        include: [
          '**/**/utils.js'
        ]
      }
    }
  })
}
