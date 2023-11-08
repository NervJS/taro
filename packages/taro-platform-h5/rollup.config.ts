import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { merge } from 'lodash'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

import type { InputPluginOption, RollupOptions } from 'rollup'

const baseConfig: RollupOptions = {
  output: {
    format: 'es',
    exports: 'named',
    sourcemap: true,
  },
  treeshake: false,
}

function getPlugins<T = InputPluginOption>(pre: T[] = [], post: T[] = []) {
  return [
    ...pre,
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    }),
    json({
      compact: true,
      preferConst: true,
    }),
    ts({
      tsconfig: (e) => ({
        ...e,
        declaration: true,
        sourceMap: true,
      }),
    }),
    commonjs(),
    ...post,
  ]
}

const variesConfig: RollupOptions[] = [
  {
    input: 'src/index.ts', // 供 CLI 编译时使用的 Taro 插件入口
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    plugins: getPlugins([
      externals({
        deps: true,
        devDeps: false,
      }),
    ]),
  },
  {
    input: [
      'src/runtime/index.ts', // 供 Loader 使用的运行时入口
      'src/runtime/apis/index.ts', // API
      'src/runtime/components/index.ts', // Components Library
    ],
    output: {
      dir: 'dist',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: getPlugins([
      externals({
        deps: true,
        devDeps: false,
      }),
    ]),
  },
]

export default defineConfig(variesConfig.map((v) => merge({}, baseConfig, v)))
