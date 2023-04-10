import * as path from 'path'
import { externals } from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const base = {
  plugins: [
    externals({
      deps: true,
      devDeps: false,
    }),
    ts(),
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    interop: 'compat',
    exports: 'named'
  },
  ...base
}

// 运行时入口
const runtimeConfig = {
  input: path.join(cwd, 'src/runtime.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

module.exports = [compileConfig, runtimeConfig]
