import * as path from 'path'
import typescript from 'rollup-plugin-typescript2'

const cwd = __dirname

const base = {
  external: [
    '@tarojs/shared',
    '@tarojs/shared/dist/template',
    '@tarojs/runtime',
    '@tarojs/helper',
    '@tarojs/runner-utils'
  ],
  plugins: [
    typescript()
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const comileConfig = {
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

module.exports = [comileConfig, runtimeConfig]
