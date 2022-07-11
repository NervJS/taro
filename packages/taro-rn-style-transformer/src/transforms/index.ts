import * as path from 'path'
import transformCSS from 'taro-css-to-react-native'
import { recursiveMerge, printLog, processTypeEnum } from '@tarojs/helper'

import postcssTransform, { Config as PostcssConfig, makePostcssPlugins } from './postcss'
import sassTransform, { Config as SassConfig, SassGlobalConfig } from './sass'
import lessTransform, { Config as LessConfig } from './less'
import stylusTransform, { Config as StylusConfig, defaultOptions as stylusDefaultOptions } from './stylus'
import { StyleSheetValidation } from './StyleSheet'
import { TransformOptions, RenderAdditionalResult } from '../types'
import { normalizeSourceMap } from '../utils'

export function getWrapedCSS (css) {
  return `
import { scalePx2dp, scaleVu2dp, createStyleSheet } from '@tarojs/runtime-rn'

// 用来标识 rn-runner transformer 是否读写缓存
function ignoreStyleFileCache() {}

export default createStyleSheet(${css})
`
}

/**
 * 校验样式
 */
function validateStyle ({ styleObject, filename }) {
  for (const name in styleObject) {
    try {
      StyleSheetValidation.validateStyle(name, styleObject)
    } catch (err) {
      // 先忽略掉 scalePx2dp 的报错
      if (/Invalid prop `.*` of type `string` supplied to `.*`, expected `number`[^]*/g.test(err.message)) return
      printLog(processTypeEnum.WARNING, err.message, `entry file: ${filename}`)
    }
  }
}

interface RNConfig {
  postcss?: PostcssConfig;
  sass?: SassConfig;
  less?: LessConfig;
  stylus?: StylusConfig;
}

interface Config {
  designWidth: number;
  deviceRatio: { [key: number]: number };
  sass: SassGlobalConfig;
  alias: Record<string, string>;
  rn: RNConfig;
}

interface PostcssParam {
  css: string
  map: any
  filename: string
  additionalData: string
  postcssConfig: PostcssConfig
  transformOptions: TransformOptions
}

const designWidth = 750

const deviceRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}

const enum ProcessTypes {
  POSTCSS = 'postcss',
  SASS = 'sass',
  LESS = 'less',
  STYLUS = 'stylus',
}

const DEFAULT_RN_CONFIG = {
  [ProcessTypes.POSTCSS]: {
    options: {},
    scalable: true
  },
  [ProcessTypes.SASS]: {
    options: {}
  },
  [ProcessTypes.LESS]: {
    options: {}
  },
  [ProcessTypes.STYLUS]: {
    options: stylusDefaultOptions
  }
}

export default class StyleTransform {
  config: Config

  processConfigMap = new Map()

  constructor (config = {}) {
    this.init(config)
  }

  init = (config) => {
    this.config = {
      designWidth: config.designWidth || designWidth,
      deviceRatio: config.deviceRatio || deviceRatio,
      sass: config.sass || {},
      alias: config.alias ?? {},
      rn: recursiveMerge({}, DEFAULT_RN_CONFIG, config.rn)
    }

    Reflect.ownKeys(this.config.rn).forEach((key: string) => {
      if (
        [
          ProcessTypes.SASS,
          ProcessTypes.LESS,
          ProcessTypes.STYLUS,
          ProcessTypes.POSTCSS
        ].includes(key.toLocaleLowerCase() as any)
      ) {
        const processConfig = {
          ...this.config.rn[key],
          alias: config.alias ?? {}
        }
        if (key.toLocaleLowerCase() === ProcessTypes.SASS) {
          processConfig.sass = this.config.sass
        }
        this.processConfigMap.set(key, processConfig)
      }
    })
  }

  /**
   * @description 样式文件处理
   * @param {string} src
   * @param {string} filename
   * @param {object} options
   */
  async processStyle (src: string, filename: string, options: TransformOptions) {
    let result: undefined | RenderAdditionalResult
    let css = src
    let map: undefined | string
    let additionalData = ''
    const ext = path.extname(filename)
    if (/.less$/i.test(ext)) {
      result = await lessTransform(src, filename, this.processConfigMap.get(ProcessTypes.LESS))
    } else if (/.s(c|a)ss$/i.test(ext)) {
      result = await sassTransform(src, filename, this.processConfigMap.get(ProcessTypes.SASS), options)
    } else if (/.styl(us)?$/i.test(ext)) {
      result = await stylusTransform(src, filename, this.processConfigMap.get(ProcessTypes.STYLUS))
    }

    if (result) {
      css = Buffer.isBuffer(result.css) ? result.css.toString() : result.css
      map = Buffer.isBuffer(result.map) ? result.map.toString() : result.map
      additionalData = result.additionalData
    }

    // postcss 插件，比如处理平台特有样式，单位转换
    return await this.postCSS({
      css,
      map,
      filename,
      additionalData,
      transformOptions: options,
      postcssConfig: this.processConfigMap.get(ProcessTypes.POSTCSS)
    })
  }

  /**
   * postcss处理
   * @param param0 PostcssParam
   * @returns {Promise | any}
   */
  postCSS ({
    css,
    map,
    filename,
    postcssConfig,
    transformOptions,
    additionalData
  }: PostcssParam) {
    const plugins = makePostcssPlugins({
      filename,
      postcssConfig,
      transformOptions,
      designWidth: this.config.designWidth,
      deviceRatio: this.config.deviceRatio,
      additionalData: additionalData
    })

    return postcssTransform(
      css,
      filename,
      {
        plugins,
        options: {
          ...postcssConfig.options,
          map: map && {
            prev: normalizeSourceMap(map, filename),
            inline: false,
            annotation: false
          }
        }
      }
    ).then(result => {
      return {
        ...result,
        filename
      }
    })
  }

  /**
   * @description 处理样式入口
   * @param {string} src
   * @param {string} filename
   * @param {object} transform
   * @return {string} JSONString
   */
  async transform (src: string, filename: string, options = {} as TransformOptions) {
    // printLog(processTypeEnum.START, '样式文件处理开始', filename)
    const result = await this.processStyle(src, filename, options)

    // 把 css 转换成对象 rn 的样式，接入 taro 的 css-to-react-native，比如有单位的处理
    const styleObject = transformCSS(
      result.css,
      {
        parseMediaQueries: true,
        scalable: this.config.rn.postcss?.scalable
      }
    )

    // stylelint，转换成对象，对对象进行校验
    validateStyle({ styleObject, filename })
    const css = JSON.stringify(styleObject, null, 2)
      .replace(/"(scalePx2dp\(.*?\))"/g, '$1')
      .replace(/"(scaleVu2dp\(.*?\))"/g, '$1')

    // 注入自适应方法 scalePx2dp
    return getWrapedCSS(css)
  }
}
