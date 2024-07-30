import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'

const __filename = fileURLToPath(new URL(import.meta.url))
const cwd = path.dirname(__filename)

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
  },
  plugins: [
    externals({
      peerDeps: true,
    }),
    json(),
    typescript()
  ]
}

// 运行时入口
const runtimeConfig = {
  input: path.join(cwd, 'src/runtime/index.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime.js'),
    sourcemap: true,
    format: 'es'
  },
  plugins: [
    externals({
      peerDeps: true,
    }),
    typescript()
  ]
}

export default [compileConfig, runtimeConfig]
