import { Config, transformSync } from '@swc/core'
import esbuild from 'esbuild'
import { defaults, omit } from 'lodash'
import requireFromString from 'require-from-string'

import { defaultMainFields } from '../constants'

import type { Loader } from 'esbuild'

export const defaultEsbuildLoader: Record<string, Loader> = {
  '.js': 'tsx',
  '.jsx': 'tsx',
  '.ts': 'tsx'
}

export interface IRequireWithEsbuildOptions {
  customConfig?: Parameters<typeof esbuild.build>[0]
  customSwcConfig?: Config
  cwd?: string
}

/** 基于 esbuild 的 require 实现 */
export function requireWithEsbuild (id: string, {
  customConfig = {},
  customSwcConfig = {},
  cwd = process.cwd()
}: IRequireWithEsbuildOptions = {}) {
  const { outputFiles = [] } = esbuild.buildSync(
    defaults(omit(customConfig, ['define', 'loader', 'plugins']), {
      absWorkingDir: cwd,
      bundle: true,
      define: defaults(customConfig.define, {
        // AMD 被 esbuild 转 ESM 后，是套着 ESM 外皮的 AMD 语法模块。
        // Webpack HarmonyDetectionParserPlugin 会阻止 AMDDefineDependencyParserPlugin 对这些模块的处理。
        // 导致这些模块报错（如 lodash）。目前的办法是把 define 置为 false，不支持 AMD 导出。
        define: 'false'
      }),
      entryPoints: [id],
      format: 'esm',
      loader: defaults(customConfig.loader, defaultEsbuildLoader),
      mainFields: defaultMainFields,
      write: false
    })
  )

  // Note: esbuild.buildSync 模式下不支持引入插件，所以这里需要手动转换
  const { code = '' } = transformSync(outputFiles[0].text, defaults(customSwcConfig, {
    jsc: { target: 'es2015' },
  }))
  return requireFromString(code, id)
}

export { esbuild }
export * from './utils'
