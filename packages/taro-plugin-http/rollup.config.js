import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import * as path from 'path'
import { externals } from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs',
    exports: 'named',
  },
  plugins: [
    externals({
      deps: true,
      devDeps: false,
    }),
    nodeResolve(),
    json(),
    ts()
  ]
}

// 运行时入口
const runtimeConfig = {
  input: path.join(cwd, 'src/runtime/index.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime.js'),
    format: 'es'
  },
  external: ['@tarojs/taro', '@tarojs/runtime', '@tarojs/shared'],
  plugins: [nodeResolve(), ts()]
}

module.exports = [compileConfig, runtimeConfig]
