import { defineConfig } from 'vitest/config'

// https://cn.vitest.dev/guide/
export default defineConfig({
  test: {
    include: ['__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      include: ['src/**/*.ts'],
    },
  },
})
