import type { swc } from '@tarojs/helper'
import type Webpack from 'webpack'

export type CompilerViteTypes = 'vite'

export type CompilerWebpackTypes = 'webpack5'

export type CompilerTypes = CompilerWebpackTypes | CompilerViteTypes

interface IPrebundle {
  enable?: boolean
  timings?: boolean
  cacheDir?: string
  force?: boolean
  include?: string[]
  exclude?: string[]
  esbuild?: Record<string, any>
  swc?: swc.Config
  webpack?: Webpack.Configuration & {
    provide?: any[]
  }
}

interface ICompiler<T> {
  type: T
  /**
   * 使用的自定义 runner 模块标识。未配置时根据 `type` 使用默认 runner。
   * 该值必须是 Node.js 可解析的非空字符串，且不能包含首尾空白。
   *
   * @example
   * ```ts
   * compiler: {
   *   type: 'webpack5',
   *   runner: '@tarojs/rspack-runner',
   * }
   * ```
   */
  runner?: string
  prebundle?: IPrebundle
  vitePlugins?: any
  /** 错误处理级别。可选值：0、1 */
  errorLevel?: number
}

export type Compiler<T extends CompilerTypes = CompilerWebpackTypes> = T | ICompiler<T>
