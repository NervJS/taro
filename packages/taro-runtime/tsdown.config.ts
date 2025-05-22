import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: 'src/**/*.ts',
    noExternal: ['@tarojs/shared'],
    treeshake: false,
    sourcemap: true,
  }),
  defineConfig({
    entry: {
      'runtime.esm': 'src/index.ts',
    },
    noExternal: ['@tarojs/shared'],
    treeshake: false,
    sourcemap: true,
  })
]
