import path from 'node:path'

import {
  isNodeModule,
  recursiveMerge,
  REG_CSS,
  REG_LESS,
  REG_NODE_MODULES,
  REG_SASS_SASS,
  REG_SASS_SCSS,
  REG_STYLUS,
  REG_TEMPLATE
} from '@tarojs/helper'
import { cloneDeep } from 'lodash'

import { FILE_COUNTER_MAP } from '../plugins/MiniCompileModePlugin'
import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.mini'
import { WebpackModule } from './WebpackModule'

import type { Func, PostcssOption } from '@tarojs/taro/types/compile'
import type { MiniCombination } from './MiniCombination'
import type { CssModuleOptionConfig, IRule } from './WebpackModule'

type CSSLoaders = {
  include?
  resourceQuery?
  use
}[]

export class MiniWebpackModule {
  combination: MiniCombination
  __postcssOption: [string, any, Func?][]

  constructor (combination: MiniCombination) {
    this.combination = combination
  }

  getModules () {
    const { appPath, config, sourceRoot, fileType } = this.combination
    const {
      buildAdapter,
      sassLoaderOption,
      lessLoaderOption,
      stylusLoaderOption,
      designWidth,
      deviceRatio
    } = config

    const { postcssOption, cssModuleOption } = this.parsePostCSSOptions()

    this.__postcssOption = getDefaultPostcssConfig({
      designWidth,
      deviceRatio,
      postcssOption,
      alias: config.alias,
    })

    const postcssPlugins = getPostcssPlugins(appPath, this.__postcssOption)

    const cssLoaders = this.getCSSLoaders(postcssPlugins, cssModuleOption)
    const resolveUrlLoader = WebpackModule.getResolveUrlLoader()
    const sassLoader = WebpackModule.getSassLoader(sassLoaderOption)
    const scssLoader = WebpackModule.getScssLoader(sassLoaderOption)
    const lessLoader = WebpackModule.getLessLoader(lessLoaderOption)
    const stylusLoader = WebpackModule.getStylusLoader(stylusLoaderOption)

    const rule: Record<string, IRule> = {
      sass: {
        test: REG_SASS_SASS,
        oneOf: this.addCSSLoader(cssLoaders, resolveUrlLoader, sassLoader)
      },
      scss: {
        test: REG_SASS_SCSS,
        oneOf: this.addCSSLoader(cssLoaders, resolveUrlLoader, scssLoader)
      },
      less: {
        test: REG_LESS,
        oneOf: this.addCSSLoader(cssLoaders, lessLoader)
      },
      stylus: {
        test: REG_STYLUS,
        oneOf: this.addCSSLoader(cssLoaders, stylusLoader)
      },
      normalCss: {
        test: REG_CSS,
        oneOf: cssLoaders
      },

      script: this.getScriptRule(),

      template: {
        test: REG_TEMPLATE,
        type: 'asset/resource',
        generator: {
          filename ({ filename }) {
            const extname = path.extname(filename)
            const nodeModulesRegx = new RegExp(REG_NODE_MODULES, 'gi')

            return filename
              .replace(sourceRoot + '/', '')
              .replace(extname, fileType.templ)
              .replace(nodeModulesRegx, 'npm')
          }
        },
        use: [WebpackModule.getLoader(path.resolve(__dirname, '../loaders/miniTemplateLoader'), {
          buildAdapter
        })]
      },

      xscript: {
        test: new RegExp(`\\${this.combination.fileType.xs || 'wxs'}$`),
        type: 'asset/resource',
        generator: {
          filename ({ filename }) {
            const nodeModulesRegx = new RegExp(REG_NODE_MODULES, 'gi')

            return filename
              .replace(sourceRoot + '/', '')
              .replace(nodeModulesRegx, 'npm')
          }
        },
        use: [WebpackModule.getLoader(path.resolve(__dirname, '../loaders/miniXScriptLoader'))]
      },

      media: this.getMediaRule(),

      font: this.getFontRule(),

      image: this.getImageRule()
    }
    return { rule }
  }

  addCSSLoader (cssLoaders, ...loader) {
    const cssLoadersCopy = cloneDeep(cssLoaders)
    cssLoadersCopy.forEach(item => {
      if (item.use) {
        item.use = [...item.use, ...loader]
      }
    })
    return cssLoadersCopy
  }

  getCSSLoaders (postcssPlugins: any[], cssModuleOption: PostcssOption.cssModules) {
    const { config } = this.combination
    const {
      cssLoaderOption
    } = config
    const extractCSSLoader = WebpackModule.getExtractCSSLoader()
    const cssLoader = WebpackModule.getCSSLoader(cssLoaderOption)
    const postCSSLoader = WebpackModule.getPostCSSLoader({
      postcssOptions: {
        plugins: postcssPlugins
      }
    })

    const cssLoaders: CSSLoaders = [{
      use: [
        extractCSSLoader,
        cssLoader,
        postCSSLoader
      ]
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
          use: [
            extractCSSLoader,
            cssLoaderWithModule,
            postCSSLoader
          ]
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
        use: [
          extractCSSLoader,
          cssLoaderWithModule,
          postCSSLoader
        ]
      })
    }

    return cssLoaders
  }

  getScriptRule () {
    const { sourceDir, config } = this.combination
    const { compile = {} } = this.combination.config
    const rule: IRule = WebpackModule.getScriptRule()

    rule.include = [
      sourceDir,
      filename => /(?<=node_modules[\\/]).*taro/.test(filename)
    ]
    if (Array.isArray(compile.include)) {
      rule.include.unshift(...compile.include)
    }

    if (Array.isArray(compile.exclude)) {
      rule.exclude = [...compile.exclude]
    }

    if (config.experimental?.compileMode === true) {
      rule.use.compilerLoader = WebpackModule.getLoader(path.resolve(__dirname, '../loaders/miniCompilerLoader'), {
        platform: config.platform.toUpperCase(),
        template: config.template,
        FILE_COUNTER_MAP,
      })
    }

    return rule
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

  getMediaRule () {
    const sourceRoot = this.combination.sourceRoot
    const { mediaUrlLoaderOption = {} } = this.combination.config
    return WebpackModule.getMediaRule(sourceRoot, mediaUrlLoaderOption)
  }

  getFontRule () {
    const sourceRoot = this.combination.sourceRoot
    const { fontUrlLoaderOption = {} } = this.combination.config
    return WebpackModule.getFontRule(sourceRoot, fontUrlLoaderOption)
  }

  getImageRule () {
    const sourceRoot = this.combination.sourceRoot
    const { imageUrlLoaderOption = {} } = this.combination.config
    return WebpackModule.getImageRule(sourceRoot, imageUrlLoaderOption)
  }
}
