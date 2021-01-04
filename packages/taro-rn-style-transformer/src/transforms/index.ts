import path from 'path'
import transformCSS from 'taro-css-to-react-native'
import { recursiveMerge, printLog, processTypeEnum } from '@tarojs/helper'

import postcssTransform, { Config as PostcssConfig, getPostcssPlugins } from './postcss'
import sassTransform, { Config as SassConfig, SassExternalConfig, processByExternal } from './sass'
import lessTransform, { Config as LessConfig } from './less'
import stylusTransform, { Config as StylusConfig, defaultOptions as stylusDefaultOptions } from './stylus'
import { StyleSheetValidation } from './StyleSheet'

export function getWrapedCSS (css) {
  return `
import { StyleSheet, Dimensions } from 'react-native'

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width
const uiWidthPx = 375

function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}

// 用来标识 rn-runner transformer 是否读写缓存
function ignoreStyleFileCache() {}

export default StyleSheet.create(${css})
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
      printLog(processTypeEnum.WARNING, err.message, filename)
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
  sass: SassExternalConfig;
  rn: RNConfig;
}

const designWidth = 750

const deviceRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}

enum StyleTypes {
  POSTCSS = 'postcss',
  SASS = 'sass',
  LESS = 'less',
  STYLUS = 'stylus',
}

const DEFAULT_RN_CONFIG = {
  [StyleTypes.POSTCSS]: {
    options: {},
    scalable: true
  },
  [StyleTypes.SASS]: {
    options: {}
  },
  [StyleTypes.LESS]: {
    options: {}
  },
  [StyleTypes.STYLUS]: {
    options: stylusDefaultOptions
  }
}

export default class StyleTransform {
  config: Config

  extConfigMap = new Map()

  constructor (config = {}) {
    this.init(config)
  }

  init = (config) => {
    this.config = {
      designWidth: config.designWidth || designWidth,
      deviceRatio: config.deviceRatio || deviceRatio,
      sass: config.sass || {},
      rn: recursiveMerge({}, DEFAULT_RN_CONFIG, config.rn)
    }
    Reflect.ownKeys(this.config.rn).forEach(key => this.extConfigMap.set(key, this.config.rn[key]))
  }

  /**
   * @description 样式文件处理
   * @param {string} src
   * @param {string} filename
   * @param {object} options
   */
  async processStyle (src: string, filename: string, options: TransformOptions) {
    let css = src
    const ext = path.extname(filename)
    if (ext === '.less') {
      css = await lessTransform(src, filename, this.extConfigMap.get(StyleTypes.LESS))
    } else if (ext === '.sass' || ext === '.scss') {
      src = processByExternal(src, filename, this.config.sass)
      css = await sassTransform(src, filename, this.extConfigMap.get(StyleTypes.SASS), options)
    } else if (ext === '.styl' || ext === '.stylus') {
      css = await stylusTransform(src, filename, this.extConfigMap.get(StyleTypes.STYLUS))
    }

    // postcss 插件，比如处理平台特有样式，单位转换
    const cssItem = await this.postCSS(css, filename, this.extConfigMap.get(StyleTypes.POSTCSS), options)
    return cssItem
  }

  /**
   * @description postcss处理
   * @param {string} css
   * @param {string} filename
   * @returns {Function | any}
   */
  postCSS (css, filename, postcssConfig: PostcssConfig, transformOptions: TransformOptions) {
    const plugins = getPostcssPlugins({
      designWidth: this.config.designWidth,
      deviceRatio: this.config.deviceRatio,
      postcssConfig,
      transformOptions
    })

    return postcssTransform(css, filename, { options: postcssConfig.options, plugins })
      .then(cssString => {
        return {
          css: cssString,
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
    printLog(processTypeEnum.START, '样式文件处理开始', filename)
    const { css: cssSrc } = await this.processStyle(src, filename, options)
    // printLog(processTypeEnum.REMIND, cssSrc, filename)
    // 把 css 转换成对象 rn 的样式，接入 taro 的 css-to-react-native，比如有单位的处理
    const styleObject = transformCSS(cssSrc, { parseMediaQueries: true, scalable: this.config.rn.postcss.scalable })
    // stylelint，转换成对象，对对象进行校验
    validateStyle({ styleObject, filename })
    const css = JSON.stringify(styleObject, null, 2).replace(/"(scalePx2dp\(.*?\))"/g, '$1')
    printLog(processTypeEnum.COMPILE, '样式文件处理完毕', filename)
    // 注入自适应方法 scalePx2dp
    return getWrapedCSS(css)
  }
}
