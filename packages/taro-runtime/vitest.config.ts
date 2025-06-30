import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

// https://cn.vitest.dev/guide/
export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
    },
    setupFiles: [resolve(__dirname, './tests/setup.ts')],
    alias: {
      '@tarojs/react': resolve(__dirname, '..', '..', 'packages/taro-react/dist/react.esm.js'),
    }
  }
})
