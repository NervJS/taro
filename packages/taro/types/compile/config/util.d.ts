import { type Input } from 'postcss'

export type Func = (...args: any[]) => any

export type IOption = Record<string, any>

export type TogglableOptions<T = IOption> = {
  enable?: boolean
  config?: T
}

export namespace PostcssOption {
  export type cssModules = TogglableOptions<{
    /** 转换模式，取值为 global/module */
    namingPattern: 'global' | string
    /** 自定义生成的class名称规则 */
    generateScopedName: string | ((localName: string, absoluteFilePath: string) => string)
  }>
  export type url = TogglableOptions<{
    limit: number
    basePath?: string | string[]
  }>
}

export interface IHtmlTransformOption {
  /** 是否启用 postcss-html-transform 插件 */
  enable?: boolean
  config?: {
    /** 当前编译平台 (此选项插件内部根据编译平台自行生成，无需传入) */
    readonly platform?: string
    /** 设置是否去除 cursor 相关样式 (h5默认值：true) */
    removeCursorStyle: boolean
  }
}

export interface IPxTransformOption {
  /** 设置 1px 是否需要被转换 */
  onePxTransform?: boolean
  /** REM 单位允许的小数位 */
  unitPrecision?: number
  /** 允许转换的属性列表 (默认 [*]) */
  propList?: string[]
  /** 黑名单里的选择器将会被忽略 */
  selectorBlackList?: Array<string | RegExp>
  /** 直接替换而不是追加一条进行覆盖 */
  replace?: boolean
  /** 允许媒体查询里的 px 单位转换 */
  mediaQuery?: boolean
  /** 设置一个可被转换的最小 px 值 */
  minPixelValue?: number
  /**
   * 转换后的单位，可选值为 rpx、vw、rem，当前仅支持小程序 (默认 rpx) 和 Web 端 (默认 rem)
   * @description Web 端使用 rem 单位时会注入脚本用于设置 body 上的 font-size 属性，其他单位无该操作
   */
  targetUnit?: 'rpx' | 'vw' | 'rem'
  /**
   * H5 字体尺寸大小基准值，开发者可以自行调整单位换算的基准值(默认20)
   * @supported h5
   */
  baseFontSize?: number
  /**
   * H5 根节点 font-size 的最大值 (默认 40)
   * @supported h5
   */
  maxRootSize?: number
  /**
   * H5 根节点 font-size 的最小值(默认 20)
   * @supported h5
   */
  minRootSize?: number
  /** 设计稿尺寸 */
  designWidth?: number | ((size?: string | number | Input) => number)
  /** 设计稿尺寸换算规则 */
  deviceRatio?: TaroGeneral.TDeviceRatio
}

export interface IPostcssOption {
  autoprefixer?: TogglableOptions
  pxtransform?: TogglableOptions<IPxTransformOption>
  cssModules?: PostcssOption.cssModules
  url?: PostcssOption.url
  /** 插件 postcss-html-transform 相关配置, 一般启用了 @tarojs/plugin-html 插件才配置 */
  htmltransform?: IHtmlTransformOption
  [key: string]: any
}

export interface ICopyOptions {
  patterns: {
    from: string
    to: string
    ignore?: string[]
    transform?: Func
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
  TEMPL: TEMPLATE_TYPES
  STYLE: STYLE_TYPES
  SCRIPT: SCRIPT_TYPES
  CONFIG: CONFIG_TYPES
}

export type IMINI_APP_FILES = {
  [key: string]: IMINI_APP_FILE_TYPE
}
