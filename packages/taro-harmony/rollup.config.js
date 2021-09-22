import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'
import { join } from 'path'

const cwd = __dirname

const base = {
  external: d => {
    return d.includes('@tarojs/shared') || d.includes('@tarojs/service') || d.includes('@tarojs/runtime') || /^@system\./.test(d)
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/template/container.js', dest: 'dist/template' },
        { src: 'src/components/components-harmony', dest: 'dist' }
      ]
    }),
    typescript({
      useTsconfigDeclarationDir: true,
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

// 供 Loader 使用的运行时入口
const runtimeConfig = {
  input: join(cwd, 'src/runtime.ts'),
  output: {
    file: join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// 供继承的包使用，为了能 tree-shaking
const runtimeUtilsConfig = {
  input: join(cwd, 'src/runtime-utils.ts'),
  output: {
    file: join(cwd, 'dist/runtime-utils.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// React 下 webpack 会 alias @tarojs/components 为此文件
const otherConfig = {
  input: join(cwd, 'src/components/components-react.ts'),
  output: {
    file: join(cwd, 'dist/components/components-react.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

module.exports = [comileConfig, runtimeConfig, runtimeUtilsConfig, otherConfig]
