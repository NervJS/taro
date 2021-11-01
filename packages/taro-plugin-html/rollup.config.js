const { join } = require('path')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const base = {
  external: ['@tarojs/shared', 'path', '@babel/parser', '@babel/traverse', '@babel/types', '@babel/generator'],
  plugins: [typescript()]
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

module.exports = [comileConfig, runtimeConfig]
