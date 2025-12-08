import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['__tests__/**/*.test.ts?(x)'],
    setupFiles: ['__mocks__/setEnv.ts'],
    alias: {
      '@tarojs/taro': resolve(__dirname, 'src/index.ts'),
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
    },
  },
})
