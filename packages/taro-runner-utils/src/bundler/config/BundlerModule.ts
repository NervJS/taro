import {
  recursiveMerge,
  REG_FONT,
  REG_IMAGE,
  REG_MEDIA,
  REG_SCRIPTS
} from '@tarojs/helper'

import { FONT_LIMIT, IMAGE_LIMIT, MEDIA_LIMIT } from '../../constant'
import { getAssetRule, getBaseSassOptions, getCssModuleOptions } from '../utils'

import type { PostcssOption } from '@tarojs/taro/types/compile'

export interface IRule {
  test?: any
  exclude?: any[]
  include?: any[]
  use?: any
  enforce?: 'pre' | 'post'
  issuer?: any
  loader?: any
  loaders?: any
  oneOf?: any
  options?: any
  query?: any
  parser?: any
  generator?: any
  resource?: any
  resourceQuery?: any
  rules?: any
  sideEffects?: boolean
  type?: string
  resolve?: any
}

export type CssModuleOptionConfig = Exclude<PostcssOption.cssModules['config'], undefined>

export interface IBundlerModuleOptions {
  resolveLoader?: (loaderName: string) => string
  loadModule?: (id: string) => any
}

export function createBundlerModule ({
  resolveLoader = loaderName => require.resolve(loaderName),
  loadModule = id => require(id)
}: IBundlerModuleOptions = {}) {
  const getLoader = (loaderName: string, options: Record<string, any> = {}) => ({
    loader: resolveLoader(loaderName),
    options
  })

  const getBaseSassOptionsImpl = () => getBaseSassOptions(loadModule('sass'))

  return class {
    static getLoader = getLoader

    static getCSSLoader = (cssLoaderOption?) => {
      const defaultOptions = {
        importLoaders: 1,
        modules: false
      }
      const options = Object.assign(defaultOptions, cssLoaderOption)
      return getLoader('css-loader', options)
    }

    static getCSSLoaderWithModule = (cssModuleOptions: CssModuleOptionConfig, cssLoaderOption?) => {
      const options = getCssModuleOptions(cssModuleOptions, cssLoaderOption)
      return getLoader('css-loader', options)
    }

    static getExtractCSSLoader = (): any => {
      const MiniCssExtractPlugin = loadModule('mini-css-extract-plugin')
      return {
        loader: MiniCssExtractPlugin.loader
      }
    }

    static getStyleLoader = (options?) => getLoader('style-loader', options)

    static getPostCSSLoader = (options?) => getLoader('postcss-loader', options)

    static getBaseSassOptions = getBaseSassOptionsImpl

    static getSassLoader = (sassLoaderOption?) => {
      const options = recursiveMerge<any>({}, getBaseSassOptionsImpl(), {
        sassOptions: {
          indentedSyntax: true
        }
      }, sassLoaderOption)
      return getLoader('sass-loader', options)
    }

    static getScssLoader = (sassLoaderOption?) => {
      const options = recursiveMerge({}, getBaseSassOptionsImpl(), sassLoaderOption)
      return getLoader('sass-loader', options)
    }

    static getLessLoader = (options?) => getLoader('less-loader', options)

    static getStylusLoader = (options?) => getLoader('stylus-loader', options)

    static getResolveUrlLoader = (options = {}) => getLoader('resolve-url-loader', options)

    static getScriptRule = (..._args: any[]): IRule => ({
      test: REG_SCRIPTS,
      use: {
        babelLoader: getLoader('babel-loader', {
          compact: false
        })
      }
    })

    static getMediaRule = (sourceRoot: string, options?) => getAssetRule(REG_MEDIA, MEDIA_LIMIT, sourceRoot, options)

    static getFontRule = (sourceRoot: string, options?) => getAssetRule(REG_FONT, FONT_LIMIT, sourceRoot, options)

    static getImageRule = (sourceRoot: string, options?) => getAssetRule(REG_IMAGE, IMAGE_LIMIT, sourceRoot, options)
  }
}

export class BundlerModule extends createBundlerModule() {}
