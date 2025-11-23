import { defineConfig } from 'vitest/config'

// https://cn.vitest.dev/guide/
export default defineConfig({
  define: {
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
    },
  },
})
