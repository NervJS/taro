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
  prebundle?: IPrebundle
  vitePlugins?: any
  /** 错误处理级别。可选值：0、1 */
  errorLevel?: number
}

export type Compiler<T extends CompilerTypes = CompilerWebpackTypes> = T | ICompiler<T>
