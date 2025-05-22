import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: 'src/**/*.ts',
    treeshake: false,
    sourcemap: true,
    platform: 'neutral'
  }),
  defineConfig({
    entry: {
      'runtime.esm': 'src/index.ts',
    },
    treeshake: false,
    sourcemap: true,
    platform: 'neutral'
  })
]
