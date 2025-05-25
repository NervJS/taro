import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: 'src/index.ts',
    treeshake: false,
    sourcemap: true,
    unbundle: true,
  }),
  defineConfig({
    entry: {
      'runtime.esm': 'src/index.ts',
    },
    treeshake: false,
    sourcemap: true,
  }),
  defineConfig({
    entry: {
      'index.cjs': 'src/index.ts',
    },
    format: 'cjs',
    outExtensions: () => ({ js: '.js' }),
    treeshake: false,
    sourcemap: true,
  }),
]
