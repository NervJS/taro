import typescript from '@rollup/plugin-typescript'
import * as path from 'path'

const cwd = __dirname

const base = {
  external: [
    '@tarojs/helper',
    '@tarojs/shared',
    '@tarojs/runtime',
    '@pmmmwh/react-refresh-webpack-plugin',
    'acorn',
    'acorn-walk'
  ],
  plugins: [
    typescript()
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

module.exports = [compileConfig, runtimeConfig, loaderConfig]
