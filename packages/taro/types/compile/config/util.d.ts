export type Func = (...args: any[]) => any

export type IOption = Record<string, any>

export type TogglableOptions<T = IOption> = {
  enable?: boolean
  config?: T
}

export namespace PostcssOption {
  export type cssModules = TogglableOptions<{
    namingPattern: 'global' | string
    generateScopedName: string | ((localName: string, absoluteFilePath: string) => string)
  }>
  export type url = TogglableOptions<{
    limit: number
    basePath?: string | string[]
  }>
}

export interface IPostcssOption {
  autoprefixer?: TogglableOptions
  pxtransform?: TogglableOptions
  cssModules?: PostcssOption.cssModules
  url?: PostcssOption.url
  [key: string]: any
}

export interface ICopyOptions {
  patterns: {
    from: string
    to: string
    ignore?: string[]
    transform?: Function
    watch?: boolean
  }[]
  options: {
    ignore?: string[]
  }
}

export interface ISassOptions {
  /**
   * 引入的全局 sass 文件，如果要引入多个文件，支持数组形式传入
   */
  resource?: string | string[]
  /**
   * 项目根目录的绝对地址(若为小程序云开发模板，则应该是client目录)
   */
  projectDirectory?: string
  /**
   * 全局 scss 变量，若 data 与 resource 中设置了同样的变量，则 data 的优先级高于 resource
   */
  data?: string
}

export interface ICompileOption {
  exclude?: string[]
  include?: string[]
}

export const enum TEMPLATE_TYPES {
  WEAPP = '.wxml',
  SWAN = '.swan',
  ALIPAY = '.axml',
  TT = '.ttml',
  QUICKAPP = '.ux',
  QQ = '.qml'
}

export const enum STYLE_TYPES {
  WEAPP = '.wxss',
  SWAN = '.css',
  ALIPAY = '.acss',
  TT = '.ttss',
  QUICKAPP = '.css',
  QQ = '.qss'
}

export const enum SCRIPT_TYPES {
  WEAPP = '.js',
  SWAN = '.js',
  ALIPAY = '.js',
  TT = '.js',
  QUICKAPP = '.js',
  QQ = '.js'
}

export const enum CONFIG_TYPES {
  WEAPP = '.json',
  SWAN = '.json',
  ALIPAY = '.json',
  TT = '.json',
  QUICKAPP = '.json',
  QQ = '.json'
}

export type IMINI_APP_FILE_TYPE = {
  TEMPL: TEMPLATE_TYPES,
  STYLE: STYLE_TYPES,
  SCRIPT: SCRIPT_TYPES,
  CONFIG: CONFIG_TYPES
}

export type IMINI_APP_FILES = {
  [key: string]: IMINI_APP_FILE_TYPE
}
