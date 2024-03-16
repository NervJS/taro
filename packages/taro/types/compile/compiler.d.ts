import type { swc } from '@tarojs/helper'
import type Webpack from 'webpack'

type CompilerTypes = 'webpack4' | 'webpack5'

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

interface ICompiler {
  type: CompilerTypes
  prebundle?: IPrebundle
  /** 错误处理级别。可选值：0、1 */
  errorLevel?: number
}

export type Compiler = CompilerTypes | ICompiler
