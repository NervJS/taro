import { join } from 'node:path'

import common from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fg from 'fast-glob'
import { type InputPluginOption, type RollupOptions, defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const base: RollupOptions & { plugins: InputPluginOption[] } = {
  external: [
    /^@(system\.|ohos\.|hmscore\/|jd-oh\/)/,
  ],
  plugins: [
    externals({
      deps: true,
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: false,
    }),
    ts({
      tsconfig: e => ({
        ...e,
        sourceMap: false,
      })
    }),
    common({
      sourceMap: false,
      exclude: ['src/runtime/**'],
    }),
    json(),
  ],
  shimMissingExports: true,
  treeshake: true,
}

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig: RollupOptions = {
  ...base,
  input: join(cwd, 'src/index.ts'),
  output: {
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: false,
    exports: 'named'
  },
  plugins: [
    ...base.plugins,
    copy({
      targets: [
        { src: 'src/runtime', dest: 'dist' },
      ]
    }) as InputPluginOption,
    {
      name: 'copy-runtime-watch',
      async buildStart () {
        const files = await fg('src/**/*')
        for (const file of files) {
          this.addWatchFile(file)
        }
      }
    }
  ]
}

export default defineConfig(compileConfig)
