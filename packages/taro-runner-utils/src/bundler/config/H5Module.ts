import {
  isNodeModule,
  recursiveMerge,
  REG_LESS,
  REG_SASS_SASS,
  REG_SASS_SCSS,
  REG_STYLE,
  REG_STYLUS
} from '@tarojs/helper'

import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.h5'
import { parsePostCSSOptions } from '../utils'

import type { Func, PostcssOption } from '@tarojs/taro/types/compile'
import type { BundlerModule, CssModuleOptionConfig, IRule } from './BundlerModule'

type CSSLoaders = {
  include?: any
  resourceQuery?: any
  use: any
}[]

const taroModuleRgx = [/@tarojs[/\\_]components/, /\btaro-components\b/]
const defaultEsnextModuleRgx = [
  /@tarojs[/\\_]components/,
  /\btaro-components\b/,
  /@tarojs[/\\_]taro-h5/,
  /\btaro-h5\b/,
  /@tarojs[/\\_]router/,
  /\btaro-router\b/
]
const isTaroModule = (filename: string) => taroModuleRgx.some(reg => reg.test(filename))
const getEsnextModuleRules = (esnextModules: (string | RegExp)[]) => [...defaultEsnextModuleRgx, ...esnextModules]

export abstract class BaseH5Module<TCombination extends Record<string, any> = any> {
  combination: TCombination
  __postcssOption: [string, any, Func?][]

  constructor (combination: TCombination) {
    this.combination = combination
  }

  protected abstract getModuleClass (): typeof BundlerModule

  protected getBaseScriptRule (): IRule {
    return this.getModuleClass().getScriptRule()
  }

  protected getPreScriptRules (): Record<string, IRule> {
    return {}
  }

  getModules () {
    const Mod = this.getModuleClass()
    const {
      styleLoaderOption = {},
      sassLoaderOption = {},
      lessLoaderOption = {},
      stylusLoaderOption = {},
      staticDirectory = 'static'
    } = this.combination.config

    const { postcssOption, cssModuleOption } = this.parsePostCSSOptions()

    const resolveUrlLoader = Mod.getResolveUrlLoader()
    const sassLoader = Mod.getSassLoader(sassLoaderOption)
    const scssLoader = Mod.getScssLoader(sassLoaderOption)
    const lessLoader = Mod.getLessLoader(lessLoaderOption)
    const stylusLoader = Mod.getStylusLoader(stylusLoaderOption)

    const rule: Record<string, IRule> = {
      taroStyle: this.getTaroStyleRule(styleLoaderOption),
      customStyle: this.getCustomStyleRule(styleLoaderOption),
      css: {
        test: REG_STYLE,
        oneOf: this.getCSSLoaders(cssModuleOption)
      },
      postcss: this.getPostCSSRule(postcssOption),
      sass: {
        test: REG_SASS_SASS,
        use: [resolveUrlLoader, sassLoader]
      },
      scss: {
        test: REG_SASS_SCSS,
        use: [resolveUrlLoader, scssLoader]
      },
      less: {
        test: REG_LESS,
        use: [lessLoader]
      },
      stylus: {
        test: REG_STYLUS,
        use: [stylusLoader]
      },
      ...this.getPreScriptRules(),
      script: this.getScriptRule(),
      media: this.getMediaRule(staticDirectory),
      font: this.getFontRule(staticDirectory),
      image: this.getImageRule(staticDirectory)
    }
    return { rule }
  }

  parsePostCSSOptions () {
    return parsePostCSSOptions(this.combination.config.postcss)
  }

  /** Taro 内置样式（@tarojs/components）必须在顶部注入，以保证可被覆盖 */
  getTaroStyleRule (styleLoaderOption) {
    const Mod = this.getModuleClass()
    const defaultConfig = {
      insert: function insertAtTop (element) {
        // eslint-disable-next-line no-var
        var parent = document.querySelector('head')
        if (parent) {
          // eslint-disable-next-line no-var
          var lastInsertedElement = (window as any)._lastElementInsertedByStyleLoader
          if (!lastInsertedElement) {
            parent.insertBefore(element, parent.firstChild)
          } else if (lastInsertedElement.nextSibling) {
            parent.insertBefore(element, lastInsertedElement.nextSibling)
          } else {
            parent.appendChild(element)
          }
          (window as any)._lastElementInsertedByStyleLoader = element
        }
      }
    }
    const options = recursiveMerge({}, defaultConfig, styleLoaderOption)
    const topStyleLoader = Mod.getStyleLoader(options)
    return {
      test: REG_STYLE,
      use: [topStyleLoader],
      include: [(filename: string) => isTaroModule(filename)]
    }
  }

  /** 开发者的样式在尾部注入 */
  getCustomStyleRule (styleLoaderOption) {
    const Mod = this.getModuleClass()
    const {
      mode,
      enableExtract = mode === 'production'
    } = this.combination.config
    const extractCssLoader = Mod.getExtractCSSLoader()
    const styleLoader = Mod.getStyleLoader(styleLoaderOption)
    const lastStyleLoader = enableExtract ? extractCssLoader : styleLoader
    return {
      test: REG_STYLE,
      use: [lastStyleLoader],
      exclude: [(filename: string) => isTaroModule(filename)]
    }
  }

  getCSSLoaders (cssModuleOption: PostcssOption.cssModules) {
    const Mod = this.getModuleClass()
    const { cssLoaderOption = {} } = this.combination.config
    const cssLoader = Mod.getCSSLoader(cssLoaderOption)

    const cssLoaders: CSSLoaders = [{
      use: [cssLoader]
    }]

    if (cssModuleOption.enable) {
      const cssModuleOptionConfig: CssModuleOptionConfig = recursiveMerge({}, {
        namingPattern: 'module',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }, cssModuleOption.config)
      const cssLoaderWithModule = Mod.getCSSLoaderWithModule(cssModuleOptionConfig, cssLoaderOption)
      const styleModuleReg = /(.*\.module).*\.(css|s[ac]ss|less|styl)\b/
      const styleGlobalReg = /(.*\.global).*\.(css|s[ac]ss|less|styl)\b/
      let cssModuleCondition

      if (cssModuleOptionConfig.namingPattern === 'module') {
        cssModuleCondition = styleModuleReg
        cssLoaders.unshift({
          resourceQuery: /module=/,
          use: [cssLoaderWithModule]
        })
      } else {
        cssModuleCondition = {
          and: [
            { not: styleGlobalReg },
            { not: isNodeModule }
          ]
        }
      }
      cssLoaders.unshift({
        include: [cssModuleCondition],
        use: [cssLoaderWithModule]
      })
    }

    return cssLoaders
  }

  getPostCSSRule (postcssOption) {
    const Mod = this.getModuleClass()
    const { appPath, config } = this.combination
    const {
      esnextModules = [] as (string | RegExp)[],
      designWidth = 750,
      deviceRatio
    } = config
    const esnextModuleRules = getEsnextModuleRules(esnextModules)

    const isEsnextModule = (filename: string) =>
      esnextModuleRules.some(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(filename)
        } else {
          return filename.indexOf(pattern) > -1
        }
      })

    this.__postcssOption = getDefaultPostcssConfig({
      designWidth,
      deviceRatio,
      option: postcssOption,
      alias: config.alias,
    })
    const postcssLoader = Mod.getPostCSSLoader({
      postcssOptions: {
        plugins: getPostcssPlugins(appPath, this.__postcssOption)
      }
    })
    return {
      test: REG_STYLE,
      use: [postcssLoader],
      exclude: [
        filename => {
          if (isTaroModule(filename)) {
            return true
          } else if (isEsnextModule(filename)) {
            return false
          } else {
            return isNodeModule(filename)
          }
        }
      ]
    }
  }

  getScriptRule () {
    const { sourceDir, config } = this.combination
    const { compile = {} } = config
    const rule: IRule = this.getBaseScriptRule()

    rule.include = [
      sourceDir,
      filename => /(?<=node_modules[\\/]).*taro/.test(filename)
    ]
    if (Array.isArray(compile.include)) {
      rule.include.unshift(...compile.include)
    }

    if (Array.isArray(compile.exclude)) {
      rule.exclude = [...compile.exclude]
    } else {
      rule.exclude = []
    }

    return rule
  }

  getMediaRule (staticDirectory: string) {
    const sourceRoot = this.combination.sourceRoot
    const { mediaUrlLoaderOption } = this.combination.config
    const options = Object.assign({
      name (filename: string) {
        return filename.replace(sourceRoot + '/', `${staticDirectory}/media/`)
      }
    }, mediaUrlLoaderOption)
    return this.getModuleClass().getMediaRule(sourceRoot, options)
  }

  getFontRule (staticDirectory: string) {
    const sourceRoot = this.combination.sourceRoot
    const { fontUrlLoaderOption } = this.combination.config
    const options = Object.assign({
      name (filename: string) {
        return filename.replace(sourceRoot + '/', `${staticDirectory}/fonts/`)
      }
    }, fontUrlLoaderOption)
    return this.getModuleClass().getFontRule(sourceRoot, options)
  }

  getImageRule (staticDirectory: string) {
    const sourceRoot = this.combination.sourceRoot
    const { imageUrlLoaderOption } = this.combination.config
    const options = Object.assign({
      name (filename: string) {
        return filename.replace(sourceRoot + '/', `${staticDirectory}/images/`)
      }
    }, imageUrlLoaderOption)
    return this.getModuleClass().getImageRule(sourceRoot, options)
  }
}
