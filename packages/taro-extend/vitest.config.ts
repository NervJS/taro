import { defineConfig } from 'vitest/config'

// https://cn.vitest.dev/guide/
export default defineConfig({
  define: {
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
  },
  test: {
    include: ['tests/**/*.spec.ts?(x)'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
    }
  }
})
