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

import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.mini'
import { parsePostCSSOptions } from '../utils'

import type { Func, PostcssOption } from '@tarojs/taro/types/compile'
import type { BundlerModule, CssModuleOptionConfig, IRule } from './BundlerModule'

type CSSLoaders = {
  include?: any
  resourceQuery?: any
  use: any
}[]

export abstract class BaseMiniModule<TCombination extends Record<string, any> = any> {
  combination: TCombination
  __postcssOption: [string, any, Func?][]

  constructor (combination: TCombination) {
    this.combination = combination
  }

  protected abstract getModuleClass (): typeof BundlerModule

  protected getTemplateLoaderPath (): string {
    return '@tarojs/runner-utils/bundler/loaders/miniTemplateLoader'
  }

  protected getXScriptLoaderPath (): string {
    return '@tarojs/runner-utils/bundler/loaders/miniXScriptLoader'
  }

  protected getXScriptDefaultExt (): string {
    return '.wxs'
  }

  protected getEffectivePostcssOption (postcssOption: Record<string, any>) {
    return postcssOption
  }

  protected getBaseScriptRule (): IRule {
    return this.getModuleClass().getScriptRule()
  }

  protected customizeScriptRule (_rule: IRule) {}
  protected getPostScriptRules (): Record<string, IRule> { return {} }
  protected getExtraRules (): Record<string, IRule> { return {} }

  getModules () {
    const Mod = this.getModuleClass()
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
      postcssOption: this.getEffectivePostcssOption(postcssOption) as any,
      alias: config.alias
    })

    const postcssPlugins = getPostcssPlugins(appPath, this.__postcssOption)

    const cssLoaders = this.getCSSLoaders(postcssPlugins, cssModuleOption)
    const resolveUrlLoader = Mod.getResolveUrlLoader()
    const sassLoader = Mod.getSassLoader(sassLoaderOption)
    const scssLoader = Mod.getScssLoader(sassLoaderOption)
    const lessLoader = Mod.getLessLoader(lessLoaderOption)
    const stylusLoader = Mod.getStylusLoader(stylusLoaderOption)

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
      ...this.getPostScriptRules(),
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
        use: [Mod.getLoader(this.getTemplateLoaderPath(), {
          buildAdapter
        })]
      },
      xscript: {
        test: new RegExp(`\\${this.combination.fileType.xs || this.getXScriptDefaultExt()}$`),
        type: 'asset/resource',
        generator: {
          filename ({ filename }) {
            const nodeModulesRegx = new RegExp(REG_NODE_MODULES, 'gi')

            return filename
              .replace(sourceRoot + '/', '')
              .replace(nodeModulesRegx, 'npm')
          }
        },
        use: [Mod.getLoader(this.getXScriptLoaderPath())]
      },
      media: this.getMediaRule(),
      font: this.getFontRule(),
      image: this.getImageRule(),
      ...this.getExtraRules()
    }

    return { rule }
  }

  addCSSLoader (cssLoaders: CSSLoaders, ...loader: any[]) {
    const cssLoadersCopy = cloneDeep(cssLoaders)
    cssLoadersCopy.forEach(item => {
      if (item.use) {
        item.use = [...item.use, ...loader]
      }
    })
    return cssLoadersCopy
  }

  getCSSLoaders (postcssPlugins: any[], cssModuleOption: PostcssOption.cssModules) {
    const Mod = this.getModuleClass()
    const { config } = this.combination
    const { cssLoaderOption } = config
    const extractCSSLoader = Mod.getExtractCSSLoader()
    const cssLoader = Mod.getCSSLoader(cssLoaderOption)
    const postCSSLoader = Mod.getPostCSSLoader({
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
      const cssLoaderWithModule = Mod.getCSSLoaderWithModule(cssModuleOptionConfig, cssLoaderOption)
      const styleModuleReg = /(.*\.module).*\.(css|s[ac]ss|less|styl)\b/
      const styleGlobalReg = /(.*\.global).*\.(css|s[ac]ss|less|styl)\b/
      let cssModuleCondition

      if (cssModuleOptionConfig.namingPattern === 'module') {
        cssModuleCondition = styleModuleReg
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
    }

    this.customizeScriptRule(rule)

    return rule
  }

  parsePostCSSOptions () {
    return parsePostCSSOptions(this.combination.config.postcss)
  }

  getMediaRule () {
    const sourceRoot = this.combination.sourceRoot
    const { mediaUrlLoaderOption = {} } = this.combination.config
    return this.getModuleClass().getMediaRule(sourceRoot, mediaUrlLoaderOption)
  }

  getFontRule () {
    const sourceRoot = this.combination.sourceRoot
    const { fontUrlLoaderOption = {} } = this.combination.config
    return this.getModuleClass().getFontRule(sourceRoot, fontUrlLoaderOption)
  }

  getImageRule () {
    const sourceRoot = this.combination.sourceRoot
    const { imageUrlLoaderOption = {} } = this.combination.config
    return this.getModuleClass().getImageRule(sourceRoot, imageUrlLoaderOption)
  }
}
