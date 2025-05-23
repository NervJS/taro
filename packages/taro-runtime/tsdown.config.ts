import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: 'src/index.ts',
    noExternal: ['@tarojs/shared'],
    treeshake: false,
    sourcemap: true,
    unbundle: true,
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
