import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import { merge } from 'lodash-es'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'

const baseConfig = {
  output: {
    format: 'es',
    exports: 'named',
    sourcemap: true,
  },
  treeshake: false,
}

function getPlugins(pre = [], post = []) {
  return [
    ...pre,
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    }),
    ts(),
    commonjs(),
    ...post,
  ]
}

const variesConfig = [
  {
    input: 'src/index.ts', // 供 CLI 编译时使用的 Taro 插件入口
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    plugins: getPlugins([
      externals({
        deps: true,
        devDeps: false,
      }),
    ]),
  },
  {
    input: [
      'src/runtime/index.ts', // 供 Loader 使用的运行时入口
      'src/runtime/apis/index.ts', // API
      'src/runtime/components/index.ts', // Components Library
    ],
    output: {
      dir: 'dist',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: getPlugins([
      externals({
        deps: true,
        devDeps: false,
      }),
    ]),
  },
]

export default defineConfig(variesConfig.map((v) => merge({}, baseConfig, v)))
