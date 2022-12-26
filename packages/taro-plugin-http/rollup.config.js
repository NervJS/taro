import json from '@rollup/plugin-json'
import * as path from 'path'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
  },
  external: ['@tarojs/shared'],
  plugins: [ json(), ts()],
}

// 运行时入口
const runtimeConfig = {
  input: path.join(cwd, 'src/runtime/index.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true,
  },
  external: ['@tarojs/taro', '@tarojs/runtime', '@tarojs/shared'],
  plugins: [ts()],
}

module.exports = [compileConfig, runtimeConfig]
