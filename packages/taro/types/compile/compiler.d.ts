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
}

export type Compiler = CompilerTypes | ICompiler
