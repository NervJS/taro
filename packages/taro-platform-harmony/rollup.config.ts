import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import { type InputPluginOption, type RollupOptions, defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import externals from 'rollup-plugin-node-externals'

const base: RollupOptions & { plugins: InputPluginOption[] } = {
  external: d => {
    return /^@(system\.|ohos\.|hmscore\/|jd-oh\/)/.test(d)
  },
  plugins: [
    externals({
      devDeps: false
    }),
    nodeResolve({
      preferBuiltins: false
    }) as InputPluginOption,
    ts({ exclude: ['rollup.config.ts'] }),
    commonjs() as InputPluginOption
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig: RollupOptions = {
  ...base,
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    ...base.plugins,
    copy({
      targets: [
        { src: 'src/template/container.js', dest: 'dist/template' },
        { src: 'src/components/components-harmony-ets', dest: 'dist' },
        { src: 'src/components/components-harmony', dest: 'dist' },
        { src: 'src/apis', dest: 'dist' },
        { src: 'src/runtime-ets', dest: 'dist' },
        { src: 'src/runtime-framework', dest: 'dist' },
      ]
    }),
  ]
}

// 供 Loader 使用的运行时入口
const runtimeConfig: RollupOptions = {
  ...base,
  input: 'src/runtime.ts',
  output: {
    file: 'dist/runtime.js',
    format: 'es',
    sourcemap: true
  }
}

// 供继承的包使用，为了能 tree-shaking
const runtimeUtilsConfig: RollupOptions = {
  ...base,
  input: 'src/runtime-utils.ts',
  output: {
    file: 'dist/runtime-utils.js',
    format: 'es',
    sourcemap: true
  }
}

// React 下 webpack 会 alias @tarojs/components 为此文件
const otherConfig: RollupOptions = {
  ...base,
  input: 'src/components/components-react.ts',
  output: {
    file: 'dist/components/components-react.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    ts({ declaration: false, exclude: ['rollup.config.ts'] })
  ]
}

export default defineConfig([compileConfig, runtimeConfig, runtimeUtilsConfig, otherConfig])
