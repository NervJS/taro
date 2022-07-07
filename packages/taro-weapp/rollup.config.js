import * as path from 'path'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const base = {
  external: ['@tarojs/shared', '@tarojs/service'],
  plugins: [ts()]
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
  input: path.join(cwd, 'src/runtime.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// 供继承的包使用，为了能 tree-shaking
const runtimeUtilsConfig = {
  input: path.join(cwd, 'src/runtime-utils.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime-utils.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// React 下 webpack 会 alias @tarojs/components 为此文件
const otherConfig = {
  input: path.join(cwd, 'src/components-react.ts'),
  output: {
    file: path.join(cwd, 'dist/components-react.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

module.exports = [compileConfig, runtimeConfig, runtimeUtilsConfig, otherConfig]
