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
import { WebpackModule } from './WebpackModule'

import type { Func, PostcssOption } from '@tarojs/taro/types/compile'
import type { H5Combination } from './H5Combination'
import type { CssModuleOptionConfig, IRule } from './WebpackModule'

type CSSLoaders = {
  include?
  resourceQuery?
  use
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

const getEsnextModuleRules = (esnextModules: (string | RegExp)[]) => {
  return [...defaultEsnextModuleRgx, ...esnextModules]
}

export class H5WebpackModule {
  combination: H5Combination
  __postcssOption: [string, any, Func?][]

  constructor (combination: H5Combination) {
    this.combination = combination
  }

  getModules () {
    const {
      styleLoaderOption = {},
      sassLoaderOption = {},
      lessLoaderOption = {},
      stylusLoaderOption = {},
      staticDirectory = 'static'
    } = this.combination.config

    const { postcssOption, cssModuleOption } = this.parsePostCSSOptions()

    const resolveUrlLoader = WebpackModule.getResolveUrlLoader()
    const sassLoader = WebpackModule.getSassLoader(sassLoaderOption)
    const scssLoader = WebpackModule.getScssLoader(sassLoaderOption)
    const lessLoader = WebpackModule.getLessLoader(lessLoaderOption)
    const stylusLoader = WebpackModule.getStylusLoader(stylusLoaderOption)

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

      script: this.getScriptRule(),

      media: this.getMediaRule(staticDirectory),

      font: this.getFontRule(staticDirectory),

      image: this.getImageRule(staticDirectory)
    }
    return { rule }
  }

  parsePostCSSOptions () {
    const { postcss: postcssOption = {} } = this.combination.config
    const defaultCssModuleOption: PostcssOption.cssModules = {
      enable: false,
      config: {
        namingPattern: 'global',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    }

    const cssModuleOption: PostcssOption.cssModules = recursiveMerge({}, defaultCssModuleOption, postcssOption.cssModules)

    return {
      postcssOption,
      cssModuleOption
    }
  }

  /** Taro 内置样式（@tarojs/components）必须在顶部注入，以保证可被覆盖 */
  getTaroStyleRule (styleLoaderOption) {
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
    const topStyleLoader = WebpackModule.getStyleLoader(options)
    return {
      test: REG_STYLE,
      use: [topStyleLoader],
      include: [(filename: string) => isTaroModule(filename)]
    }
  }

  /** 开发者的样式在尾部注入 */
  getCustomStyleRule (styleLoaderOption) {
    const {
      mode,
      enableExtract = mode === 'production'
    } = this.combination.config
    const extractCssLoader = WebpackModule.getExtractCSSLoader()
    const styleLoader = WebpackModule.getStyleLoader(styleLoaderOption)
    const lastStyleLoader = enableExtract ? extractCssLoader : styleLoader
    return {
      test: REG_STYLE,
      use: [lastStyleLoader],
      exclude: [(filename: string) => isTaroModule(filename)]
    }
  }

  getCSSLoaders (cssModuleOption: PostcssOption.cssModules) {
    const { cssLoaderOption = {} } = this.combination.config
    const cssLoader = WebpackModule.getCSSLoader(cssLoaderOption)

    const cssLoaders: CSSLoaders = [{
      use: [cssLoader]
    }]

    if (cssModuleOption.enable) {
      const cssModuleOptionConfig: CssModuleOptionConfig = recursiveMerge({}, {
        namingPattern: 'module',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }, cssModuleOption.config)
      const cssLoaderWithModule = WebpackModule.getCSSLoaderWithModule(cssModuleOptionConfig, cssLoaderOption)
      const styleModuleReg = /(.*\.module).*\.(css|s[ac]ss|less|styl)\b/
      const styleGlobalReg = /(.*\.global).*\.(css|s[ac]ss|less|styl)\b/
      let cssModuleCondition

      if (cssModuleOptionConfig.namingPattern === 'module') {
        /* 不排除 node_modules 内的样式 */
        cssModuleCondition = styleModuleReg
        // for vue
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
    const { appPath, config } = this.combination
    const {
      esnextModules = [] as (string | RegExp)[],
      designWidth = 750,
      deviceRatio
    } = config
    const esnextModuleRules = getEsnextModuleRules(esnextModules)

    /**
     * isEsnextModule
     *
     * 使用正则匹配判断是否是es模块
     * 规则参考：https://github.com/webpack/webpack/blob/master/lib/RuleSet.js#L413
     */
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
      option: postcssOption
    })
    const postcssLoader = WebpackModule.getPostCSSLoader({
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
    const { sourceDir } = this.combination
    const { compile = {} } = this.combination.config
    const rule: IRule = WebpackModule.getScriptRule()

    if (compile.exclude && compile.exclude.length) {
      rule.exclude = [
        ...compile.exclude,
        filename => /css-loader/.test(filename) || (/node_modules/.test(filename) && !(/taro/.test(filename)))
      ]
    } else if (compile.include && compile.include.length) {
      rule.include = [
        ...compile.include,
        sourceDir,
        filename => /taro/.test(filename)
      ]
    } else {
      /**
       * 要优先处理 css-loader 问题
       *
       * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/471#issuecomment-750266195
       *
       * 若包含 @tarojs/components，则跳过 babel-loader 处理
       * 除了包含 taro 和 inversify 的第三方依赖均不经过 babel-loader 处理
       */
      rule.exclude = [filename =>
        /css-loader/.test(filename)
        || /@tarojs[\\/]components/.test(filename)
        || (/node_modules/.test(filename) && !(/taro/.test(filename) || /inversify/.test(filename)))]
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
    return WebpackModule.getMediaRule(sourceRoot, options)
  }

  getFontRule (staticDirectory: string) {
    const sourceRoot = this.combination.sourceRoot
    const { fontUrlLoaderOption } = this.combination.config
    const options = Object.assign({
      name (filename: string) {
        return filename.replace(sourceRoot + '/', `${staticDirectory}/fonts/`)
      }
    }, fontUrlLoaderOption)
    return WebpackModule.getFontRule(sourceRoot, options)
  }

  getImageRule (staticDirectory: string) {
    const sourceRoot = this.combination.sourceRoot
    const { imageUrlLoaderOption } = this.combination.config
    const options = Object.assign({
      name (filename: string) {
        return filename.replace(sourceRoot + '/', `${staticDirectory}/images/`)
      }
    }, imageUrlLoaderOption)
    return WebpackModule.getImageRule(sourceRoot, options)
  }
}
