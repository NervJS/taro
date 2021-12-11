import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'
import { join } from 'path'

const cwd = __dirname

const base = {
  plugins: [
    copy({
      targets: [
        { src: 'src/backend/index.js', dest: 'dist/backend' }
      ]
    }),
    typescript({
      // fix https://github.com/vladshcherbin/rollup-plugin-copy/issues/16
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true
    })
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const comileConfig = {
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
    file: join(cwd, 'dist/loader.js'),
    format: 'cjs',
    sourcemap: true
  },
  ...base
}

module.exports = [comileConfig, runtimeConfig, loaderConfig]
