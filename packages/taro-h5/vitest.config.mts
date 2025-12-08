import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
    setupFiles: ['__mocks__/setEnv.ts'],
    alias: {
      '@tarojs/taro': resolve(__dirname, 'src/index.ts'),
      '@tarojs/taro-h5': resolve(__dirname, 'src/index.ts'),
      '@tarojs/shared': resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
      '@tarojs/plugin-framework-react/dist/runtime': resolve(__dirname, '__mocks__/taro-framework'),
      '@tarojs/plugin-framework-vue3/dist/runtime': resolve(__dirname, '__mocks__/taro-framework'),
      platform: resolve(__dirname, '__mocks__/platform.ts'),
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
    },
  },
})
