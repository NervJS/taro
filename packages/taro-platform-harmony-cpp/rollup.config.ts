import common from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import fg from 'fast-glob'
import { type InputPluginOption, type RollupOptions, defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import externals from 'rollup-plugin-node-externals'

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig: RollupOptions = {
  external: [
    /^@(system\.|ohos\.|hmscore\/|jd-oh|taro-oh\/)/,
  ],
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: false,
    exports: 'named'
  },
  plugins: [
    externals({
      deps: true,
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: false,
    }),
    ts(),
    common(),
    json(),
    copy({
      targets: [
        { src: 'src/runtime', dest: 'dist' },
      ]
    }) as InputPluginOption,
    process.env.ROLLUP_WATCH ? {
      name: 'copy-runtime-watch',
      async buildStart () {
        const files = await fg('src/**/*')
        for (const file of files) {
          this.addWatchFile(file)
        }
      }
    } : null
  ]
}

const apiConfig: RollupOptions = {
  input: 'src/runtime/apis/index.ts',
  output: {
    file: 'dist/runtime/apischunk/index.js',
    format: 'esm',
    sourcemap: false,
    exports: 'named'
  },
  external: d => {
    return /^@(system\.|ohos\.|hmscore\/|jd-oh|taro-oh\/)/.test(d)
  },
  plugins: [
    externals({
      devDeps: false,
      exclude: [/@tarojs\/plugin-platform-harmony-ets/]
    }),
    nodeResolve({
      preferBuiltins: false
    }),
    ts(),
    common(),
    json(),
  ]
}

const dtsConfigCjs: RollupOptions = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
  },
  plugins: [dts()],
}

const dtsConfigEsm: RollupOptions = {
  input: 'src/runtime/apis/index.ts',
  output: {
    file: 'dist/runtime/apischunk/index.d.ts',
  },
  plugins: [dts()],
}

export default defineConfig([compileConfig, apiConfig, dtsConfigCjs, dtsConfigEsm])
