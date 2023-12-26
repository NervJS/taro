import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { merge } from 'lodash'
import path from 'path'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

import exportNameOnly from './build/rollup-plugin-export-name-only'

import type { InputPluginOption, RollupOptions } from 'rollup'

const cwd = __dirname

const baseConfig: RollupOptions = {
  output: {
    format: 'es',
    exports: 'named',
    sourcemap: true,
  },
  treeshake: false
}

function getPlugins<T = InputPluginOption> (pre: T[] = [], post: T[] = []) {
  return [
    ...pre,
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['main:harmony-hybrid', 'browser', 'module', 'jsnext:main', 'main']
    }),
    json({
      compact: true,
      preferConst: true,
    }),
    ts({
      tsconfig: e => ({
        ...e,
        declaration: true,
        sourceMap: true,
      })
    }),
    commonjs(),
    ...post
  ]
}

const variesConfig: RollupOptions[] = [{
  input: 'src/index.ts', // 供 CLI 编译时使用的 Taro 插件入口
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: getPlugins([externals({
    deps: true,
    devDeps: false,
  })])
}, {
  input: [
    'src/api/apis/index.ts', // APIS
    'src/api/apis/taro.ts', // APIS
    'src/api/index.ts', // APIS
    'src/components/react/index.ts', // React 组件
    'src/components/vue2/index.ts', // vue2 组件
    'src/components/vue3/index.ts', // vue3 组件
    'src/runtime/index.ts', // 供 Loader 使用的运行时入口
    'src/runtime/apis/index.ts', // API 入口
    'src/runtime/components/index.ts', // Components Library
  ],
  output: {
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: getPlugins([externals({
    deps: true,
    devDeps: false,
  })])
}, {
  input: path.join(cwd, 'src/runtime/apis/index.ts'), // 供 babel-plugin-transform-taroapi 使用，为了能 tree-shaking
  output: {
    file: 'dist/taroApis.js',
    format: 'cjs',
    inlineDynamicImports: true
  },
  plugins: getPlugins([exportNameOnly()])
}]

if (process.env.NODE_ENV === 'production') {
  variesConfig.push({
    input: path.join(cwd, 'build/rollup-plugin-export-name-only.js'),
    output: {
      file: 'dist/rollup-plugin-export-name-only.js',
      format: 'cjs',
      sourcemap: false
    },
  })
}

// if (process.env.NODE_ENV === 'production') {
//   variesConfig.push({
//     input: 'src/api/index.ts',
//     output: {
//       format: 'cjs',
//       file: 'dist/api/index.cjs.js',
//       inlineDynamicImports: true
//     }
//   }, {
//     input: 'src/api/index.ts',
//     output: {
//       file: 'dist/api/index.esm.js',
//       inlineDynamicImports: true
//     }
//   })
// }

export default defineConfig(variesConfig.map(v => merge({}, baseConfig, v)))
