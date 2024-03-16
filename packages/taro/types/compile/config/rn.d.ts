import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type webpackDevServer from 'webpack-dev-server'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { IOption, IPostcssOption } from './util'

export interface IRNConfig {
  /** 设置 RN bundle 中注册应用的名称 */
  appName?: string

  /** entry 利用模块查找规则{name}.{platform}.{ext}自动区分平台 */
  entry?: string

  /** 设置 Metro 打包生成 bundle 的输出路径，默认 dist 目录下 */
  output?: any

  /** [sass](https://github.com/sass/node-sass#options) 相关配置 */
  sass?: IOption

  /** [less](https://lesscss.org/usage/#less-options) 相关配置 */
  less?: IOption

  /** [stylus](https://github.com/NervJS/taro/blob/main/packages/taro-rn-style-transformer/README.md#rnstylus) 相关配置 */
  stylus?: IOption

  /** 配置 postcss 相关插件 */
  postcss?: {
    /** postcss 配置，参考 https://github.com/postcss/postcss#options */
    options?: any
    /** 默认true，控制是否对 css value 进行 scalePx2dp 转换，pxtransform配置 enable 才生效 */
    scalable?: boolean
    pxtransform?: {
      enable?: boolean
      /** 插件 pxtransform 配置项 */
      config?: {
        additionalProperties?: boolean
        [key: string]: any
      }
    },
    cssModules?: {
      enable: boolean
    },
    [key: string]: any
  }

  resolve?: any

  /** 支持多 className 转换，以 classname 或 style 结尾的， 提取前缀， 然后根据前缀，再生成对应的 xxxStyle。如：barClassName -> barStyle。默认值 false，不开启 */
  enableMultipleClassName?: boolean

  /** 当标签 style 属性值是数组时转换成对象。默认值 false，不开启 */
  enableMergeStyle?: boolean

  /** 将 svg 文件转换为组件引入。默认值 false，不开启 */
  enableSvgTransform?: boolean

  alias?: IOption

  /** 设计稿尺寸 */
  designWidth?: number | ((size?: string | number | Input) => number)

  /** 设计稿尺寸换算规则 */
  deviceRatio?: TaroGeneral.TDeviceRatio
}
