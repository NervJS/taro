import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'
import ts from 'rollup-plugin-ts'

import type { InputPluginOption } from 'rollup'

// 供 Loader 使用的运行时入口
export default defineConfig({
  input: 'src/index.ts',
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: [/^react$/]
    }) as InputPluginOption,
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }) as InputPluginOption,
    postcss({
      extract: true,
      inject: { insertAt: 'top' },
      minimize: true,
    }) as InputPluginOption,
    ts({
      tsconfig: e => ({
        ...e,
        sourceMap: true,
      })
    }) as InputPluginOption,
    commonjs({
      include: '../../node_modules/**'
    }) as InputPluginOption,
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ],
  treeshake: false,
  output: {
    chunkFileNames: '[name].js',
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true
  }
})
