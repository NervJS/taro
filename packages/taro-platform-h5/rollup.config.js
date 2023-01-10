import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { merge } from 'lodash'
import * as path from 'path'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

import exportNameOnly from './build/rollup-plugin-export-name-only'

const cwd = __dirname

const baseConfig = {
  output: {
    format: 'es',
    exports: 'named',
    sourcemap: true,
  },
  treeshake: false
}

function getPlugins (pre = [], post = []) {
  return [
    ...pre,
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    ts({
      sourcemap: true,
    }),
    commonjs(),
    ...post
  ]
}

const variesConfig = [{
  input: path.join(cwd, 'src/index.ts'), // 供 CLI 编译时使用的 Taro 插件入口
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs'
  },
  plugins: getPlugins([externals()])
}, {
  input: path.join(cwd, 'src/runtime/index.ts'), // 供 Loader 使用的运行时入口
  output: {
    dir: path.join(cwd, 'dist'),
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: getPlugins([externals()])
}, {
  input: path.join(cwd, 'src/runtime/apis/index.ts'), // API
  output: {
    dir: path.join(cwd, 'dist'),
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: getPlugins([externals()])
}, {
  input: path.join(cwd, 'src/runtime/apis/index.ts'), // 供 babel-plugin-transform-taroapi 使用，为了能 tree-shaking
  output: {
    file: 'dist/taroApis.js',
    format: 'cjs',
    inlineDynamicImports: true
  },
  plugins: getPlugins([
    externals({
      exclude: ['@tarojs/components', '@tarojs/taro-h5']
    })
  ], [exportNameOnly()])
}]

export default variesConfig.map(v => merge({}, baseConfig, v))
