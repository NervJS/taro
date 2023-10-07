import type { swc } from '@tarojs/helper'
import type Webpack from 'webpack'

export type CompilerTypes = CompilerWebpackTypes | 'vite'

export type CompilerWebpackTypes = 'webpack5' | 'webpack4'

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
}

export type Compiler<T extends CompilerTypes = CompilerWebpackTypes> = T | ICompiler<T>
