import ts from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import externals from 'rollup-plugin-node-externals'

import type { RollupOptions } from 'rollup'

// 定义输出格式
const formats = [
  // 保留模块结构的输出
  {
    format: 'esm' as const,
    preserveModules: true,
    preserveModulesRoot: 'src',
    dir: 'dist',
    entryFileNames: '[name].js',
  },
  // CJS 格式输出
  {
    format: 'cjs' as const,
    file: 'dist/index.cjs.js',
  },
  // ESM 格式输出
  {
    format: 'es' as const,
    file: 'dist/runtime.esm.js',
  },
]

const configs: RollupOptions[] = []

// 为每种格式创建 JS 和 DTS 配置
for (const format of formats) {
  // JS 配置
  configs.push({
    input: 'src/index.ts',
    output: {
      ...format,
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      externals(),
      ts({
        // 不生成类型定义文件，由 dts 插件负责
        declaration: false,
      }),
    ],
  })

  // DTS 配置
  const dtsOutput = { ...format }

  // 修改输出文件名，将 .js 替换为 .d.ts
  if (dtsOutput.file) {
    dtsOutput.file = dtsOutput.file.replace(/\.js$/, '.d.ts')
  } else if (dtsOutput.entryFileNames) {
    dtsOutput.entryFileNames = dtsOutput.entryFileNames.replace(/\.js$/, '.d.ts')
  }

  configs.push({
    input: 'src/index.ts',
    output: dtsOutput,
    plugins: [dts()],
  })
}

export default defineConfig(configs)
