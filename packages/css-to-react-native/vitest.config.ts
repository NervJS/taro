import { defineConfig } from 'vitest/config'

// https://cn.vitest.dev/guide/
export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts?(x)'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
    }
  }
})
