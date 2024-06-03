import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'

const __filename = fileURLToPath(new URL(import.meta.url))
const cwd = path.dirname(__filename)

const base = {
  plugins: [
    externals(),
    typescript(),
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  ...base
}

// 供 Loader 使用的运行时入口
const runtimeConfig = {
  input: path.join(cwd, 'src/runtime/index.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// loader 入口
const loaderConfig = {
  input: path.join(cwd, 'src/api-loader.ts'),
  output: {
    exports: 'auto',
    file: path.join(cwd, 'dist/api-loader.js'),
    format: 'cjs',
    sourcemap: true
  },
  ...base
}

export default [compileConfig, runtimeConfig, loaderConfig]
