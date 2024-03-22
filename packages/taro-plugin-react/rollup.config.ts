import path from 'path'
import { defineConfig } from 'rollup'
import { externals } from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

import type { RollupOptions } from 'rollup'

const cwd = __dirname

const base: RollupOptions = {
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: [/@tarojs/]
    }),
    ts(),
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig: RollupOptions = {
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
const runtimeConfig: RollupOptions = {
  input: path.join(cwd, 'src/runtime/index.ts'),
  output: {
    file: path.join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

const reconcilerConfig: RollupOptions = {
  input: path.join(cwd, 'src/runtime/reconciler/index.ts'),
  output: {
    file: path.join(cwd, 'dist/reconciler.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// loader 入口
const loaderConfig: RollupOptions = {
  input: path.join(cwd, 'src/api-loader.ts'),
  output: {
    exports: 'auto',
    file: path.join(cwd, 'dist/api-loader.js'),
    format: 'cjs',
    sourcemap: true
  },
  ...base
}

export default defineConfig([
  compileConfig,
  loaderConfig,
  reconcilerConfig,
  runtimeConfig,
])
