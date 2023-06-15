import { ProcessOptions } from 'postcss'
import { Options } from 'sass'

// sass
// https://github.com/sass/node-sass#options
export interface SassConfig {
  sass?: SassGlobalConfig
  alias?: Record<string, string>
  options: Options
  additionalData?: string | ((key: string) => string)
}

export interface SassGlobalConfig {
  resource?: string | string[]
  projectDirectory?: string
  data?: string
}

// postcss
export interface PostcssConfig {
  options: ProcessOptions // https://github.com/postcss/postcss#options
  scalable: boolean // 控制是否对 css value 进行 scalePx2dp 转换
  pxtransform?: {
    enable: boolean
    config: any
  }
}

// less
interface SourceMapOption {
  sourceMapURL?: string
  sourceMapBasepath?: string
  sourceMapRootpath?: string
  outputSourceFiles?: boolean
  sourceMapFileInline?: boolean
}
// http://lesscss.org/usage/#less-options
export interface LessOptions {
  sourceMap?: SourceMapOption
  /** Filename of the main file to be passed to less.render() */
  filename?: string
  /** The locations for less looking for files in @import rules */
  paths?: string[]
  /** True, if run the less parser and just reports errors without any output. */
  lint?: boolean
  /** Pre-load global Less.js plugins */
  plugins?: Plugin[]
  /** @deprecated If true, compress using less built-in compression. */
  compress?: boolean
  strictImports?: boolean
  /** If true, allow imports from insecure https hosts. */
  insecure?: boolean
  depends?: boolean
  maxLineLen?: number
  /** @deprecated If false, No color in compiling. */
  color?: boolean
  /** @deprecated False by default. */
  ieCompat?: boolean
  /** @deprecated If true, enable evaluation of JavaScript inline in `.less` files. */
  javascriptEnabled?: boolean
  /** Whether output file information and line numbers in compiled CSS code. */
  dumpLineNumbers?: 'comment' | string
  /** Add a path to every generated import and url in output css files. */
  rootpath?: string
  /** Math mode options for avoiding symbol conficts on math expressions. */
  math?: 'always' | 'strict' | 'parens-division' | 'parens' | 'strict-legacy' | number
  /** If true, stops any warnings from being shown. */
  silent?: boolean
  /** Without this option, Less attempts to guess at the output unit when it does maths. */
  strictUnits?: boolean
  /** Defines a variable that can be referenced by the file. */
  globalVars?: {
    [key: string]: string
  }
  /** Puts Var declaration at the end of base file. */
  modifyVars?: {
    [key: string]: string
  }
  /** Read files synchronously in Node.js */
  syncImport?: boolean
}

export interface LessConfig {
  alias?: Record<string, string>
  options: LessOptions
  additionalData?: string | ((key: string) => string)
}

// stylus
class Evaluator { }

interface Dictionary<T> {
  [key: string]: T
}

// https://stylus-lang.com/docs/js.html
export interface StylusRenderOptions {
  globals?: Dictionary<any>
  functions?: Dictionary<any>
  imports?: string[]
  paths?: string[]
  filename?: string
  Evaluator?: typeof Evaluator
  /**
   * Specify Stylus plugins to use. Plugins may be passed as
   * strings instead of importing them in your Webpack config.
   *
   * @type {(string|Function)[]}
   * @default []
   */
  use: (string | ((string) => string))[]
  /**
   * Add path(s) to the import lookup paths.
   *
   * @type {string[]}
   * @default []
   */
  include: string[]
  /**
   * Import the specified Stylus files/paths.
   *
   * @type {string[]}
   * @default []
   */
  import: string[]

  /**
   * Define Stylus variables or functions.
   *
   * @type {Array|Object}
   * @default {}
   */
  // Array is the recommended syntax: [key, value, raw]
  define: Array<any> | Record<string, any>
  // Object is deprecated syntax (there is no possibility to specify "raw')
  // define: {
  //   $development: process.env.NODE_ENV === 'development',
  //   rawVar: 42,
  // },

  /**
   * Include regular CSS on @import.
   *
   * @type {boolean}
   * @default false
   */
  includeCSS: boolean

  /**
   * Resolve relative url()'s inside imported files.
   *
   * @see https://stylus-lang.com/docs/js.html#stylusresolveroptions
   *
   * @type {boolean|Object}
   * @default { nocheck: true }
   */
  // resolveURL: boolean | Record<string, any>,
  // resolveURL: { nocheck: true },

  /**
   * Emits comments in the generated CSS indicating the corresponding Stylus line.
   *
   * @see https://stylus-lang.com/docs/executable.html
   *
   * @type {boolean}
   * @default false
   */
  lineNumbers: boolean
  /**
   * @type {boolean}
   * @default false
   */
  disableCache: boolean

  /**
   * Move @import and @charset to the top.
   *
   * @see https://stylus-lang.com/docs/executable.html
   *
   * @type {boolean}
   * @default false
   */
  hoistAtrules: boolean
}

export interface StylusConfig {
  alias?: Record<string, string>
  options: StylusRenderOptions
  additionalData?: string | ((key: string) => string)
}

// config
interface RNConfig {
  postcss?: PostcssConfig
  sass?: SassConfig
  less?: LessConfig
  stylus?: StylusConfig
}

export interface Config {
  designWidth?: number | ((size?: string | number) => number)
  deviceRatio?: Record<string, number>
  sass?: SassGlobalConfig
  alias?: Record<string, string>
  rn: RNConfig
}

export interface TransformOptions {
  dev?: boolean
  hot?: boolean
  minify?: boolean
  platform: 'android' | 'ios'
  projectRoot?: string
  publicPath?: string
  customTransformOptions?: any
  config: Config
}

// resolve
export const enum ResolveLogLevelEnum {
  ERROR = 'error',
  WARNING = 'warning',
}

export interface ResolveStyleOptions {
  basedir: string
  platform: 'android' | 'ios'
  paths?: string[]
  logLevel?: ResolveLogLevelEnum
  defaultExt?: string
  alias?: Record<string, string>
}

// postcss result
export interface RenderResult {
  css: string | Buffer
  map?: string | Buffer
}

export interface RenderAdditionalResult extends RenderResult {
  additionalData: string
}
