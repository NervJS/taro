import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'
import * as t from 'babel-types'

import { BUILD_TYPES } from './constants'
import { IBabelOptions } from '../config/babel'

export interface IInstallOptions {
  dev: boolean,
  peerDependencies?: boolean
}

export interface INpmConfig {
  dir: string,
  name: string
}

export interface IResolvedCache  {
  [key: string]: {
    main: string,
    files: string[]
  }
}

export interface IPrettierConfig {
  printWidth?: number,
  tabWidth?: number,
  useTabs?: boolean,
  semi?: boolean,
  singleQuote?: boolean,
  jsxSingleQuote?: boolean,
  trailingComma?: 'none' | 'es5' | 'all',
  bracketSpacing?: boolean,
  jsxBracketSameLine?: boolean,
  arrowParens?: 'avoid' | 'always',
  rangeStart?: number,
  rangeEnd?: number,
  parser?: 'babylon' | 'flow' | 'typescript' | 'css' | 'scss' | 'less' | 'json' | 'json5' | 'json-stringify' | 'graphql' | 'markdown' | 'mdx' | 'html' | 'vue' | 'angular' | 'yaml',
  filepath?: string,
  requirePragma?: boolean,
  insertPragma?: boolean,
  proseWrap?: 'always' | 'never' | 'preserve',
  htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore',
  endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr'
}

export interface IBuildConfig {
  type?: BUILD_TYPES,
  watch?: boolean
}

export interface IMiniAppBuildConfig {
  adapter: BUILD_TYPES,
  watch?: boolean
}

export interface IOption {
  [key: string]: any
}

export interface ICopyOptions {
  patterns: {
    from: string,
    to: string,
    ignore?: string[]
  }[],
  options: {
    ignore?: string[]
  }
}

export interface IWxTransformResult {
  code: string,
  ast: t.File,
  template: string,
  compressedTemplate: string,
  components: {
    name: string,
    path: string,
    type: string
  }[],
  componentProperies: string[]
}

export namespace PostcssOption {
  export type cssModules = TogglableOptions<{
    namingPattern: 'global' | string
    generateScopedName: string
  }>
  export type url = TogglableOptions<{
    limit: number
  }>
}

export interface IPostcssOption {
  autoprefixer?: TogglableOptions,
  pxtransform?: TogglableOptions,
  cssModules?: PostcssOption.cssModules,
  url?: PostcssOption.url,
  [key: string]: any
}

export interface ICompileOption {
  exclude?: string[],
  include?: string[]
}

export interface IMiniAppConfig {
  appOutput: boolean,
  module?: {
    postcss?: IPostcssOption
  },
  compile?: ICompileOption
}

type TogglableOptions<T = IOption> = {
  enable?: boolean,
  config?: T
}

export interface IH5Config {
  webpack: ((webpackConfig: webpack.Configuration, webpack) => webpack.Configuration) | webpack.Configuration,
  webpackChain: (chain: any, webpack: any) => void,
  dllWebpackChain: (chain: any, webpack: any) => void,

  alias: IOption,
  entry: webpack.Entry,
  output: webpack.Output,
  router?: {
    mode?: 'hash' | 'browser',
    custouRoutes?: IOption
  },
  devServer: webpackDevServer.Configuration,
  enableSourceMap: boolean,
  enableExtract: boolean,
  enableDll: boolean,

  cssLoaderOption: IOption,
  styleLoaderOption: IOption,
  sassLoaderOption: IOption,
  lessLoaderOption: IOption,
  stylusLoaderOption: IOption,
  mediaUrlLoaderOption: IOption,
  fontUrlLoaderOption: IOption,
  imageUrlLoaderOption: IOption,
  miniCssExtractPluginOption: IOption,
  dllDirectory: string,
  dllFilename: string,
  dllEntry: {
    [key: string]: string[]
  },
  esnextModules: string[],

  module?: {
    postcss?: IPostcssOption
  }
}

export interface IProjectConfig {
  projectName?: string,
  date?: string,
  designWidth?: number,
  watcher?: [],
  deviceRatio?: {
    [key: string]: number
  },
  sourceRoot?: string,
  outputRoot?: string,
  plugins?: {
    babel?: IBabelOptions,
    csso?: TogglableOptions,
    uglify?: TogglableOptions
  },
  env?: IOption,
  alias?: IOption,
  defineConstants?: IOption,
  copy?: ICopyOptions,
  weapp?: IMiniAppConfig,
  h5?: IH5Config
}
