import { join } from 'path'
import copy from 'rollup-plugin-copy'
import { externals } from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const base = {
  plugins: [
    externals({
      deps: true,
      devDeps: false,
    }),
    copy({
      targets: [
        { src: 'src/backend/index.js', dest: 'dist/backend' }
      ]
    }),
    ts()
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig = {
  input: join(cwd, 'src/index.ts'),
  output: {
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  ...base
}

// 运行时入口
const runtimeConfig = {
  input: join(cwd, 'src/runtime.ts'),
  output: {
    file: join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// loader 入口
const loaderConfig = {
  input: join(cwd, 'src/loader.ts'),
  output: {
    exports: 'auto',
    file: join(cwd, 'dist/loader.js'),
    format: 'cjs',
    sourcemap: true
  },
  ...base
}

module.exports = [compileConfig, runtimeConfig, loaderConfig]
