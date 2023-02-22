/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import {
  recursiveMerge,
  REG_FONT,
  REG_IMAGE,
  REG_MEDIA,
  REG_SCRIPTS
} from '@tarojs/helper'
import { isFunction } from '@tarojs/shared'
import fs from 'fs-extra'
import path from 'path'

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

export class WebpackModule {
  static getLoader (loaderName: string, options: Record<string, any> = {}) {
    return {
      loader: require.resolve(loaderName),
      options
    }
  }

  static getCSSLoader (cssLoaderOption) {
    const defaultOptions = {
      importLoaders: 1,
      modules: false
    }
    const options = Object.assign(defaultOptions, cssLoaderOption)
    return WebpackModule.getLoader('css-loader', options)
  }

  static getCSSLoaderWithModule (cssModuleOptions: CssModuleOptionConfig, cssLoaderOption) {
    const { namingPattern, generateScopedName } = cssModuleOptions
    const defaultOptions = Object.assign(
      {
        importLoaders: 1,
        modules: {
          mode: namingPattern === 'module' ? 'local' : 'global'
        }
      },
      {
        modules: isFunction(generateScopedName)
          ? { getLocalIdent: (context, _, localName) => generateScopedName(localName, context.resourcePath) }
          : { localIdentName: generateScopedName }
      }
    )
    const options = recursiveMerge({}, defaultOptions, cssLoaderOption)
    return WebpackModule.getLoader('css-loader', options)
  }

  static getExtractCSSLoader () {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    return {
      loader: MiniCssExtractPlugin.loader
    }
  }

  static getStyleLoader (options) {
    return WebpackModule.getLoader('style-loader', options)
  }

  static getPostCSSLoader (options) {
    return WebpackModule.getLoader('postcss-loader', options)
  }

  static getBaseSassOptions () {
    return {
      sourceMap: true,
      implementation: require('sass'),
      sassOptions: {
        outputStyle: 'expanded',
        fiber: false,
        importer (url, prev, done) {
          // 让 sass 文件里的 @import 能解析小程序原生样式文体，如 @import "a.wxss";
          const extname = path.extname(url)
          // fix: @import 文件可以不带scss/sass缀，如: @import "define";
          if (extname === '.scss' || extname === '.sass' || extname === '.css' || !extname) {
            return null
          } else {
            const filePath = path.resolve(path.dirname(prev), url)
            fs.access(filePath, fs.constants.F_OK, (err) => {
              if (err) {
                console.log(err)
                return null
              } else {
                fs.readFile(filePath)
                  .then(res => {
                    done({ contents: res.toString() })
                  })
                  .catch(err => {
                    console.log(err)
                    return null
                  })
              }
            })
          }
        }
      }
    }
  }

  static getSassLoader (sassLoaderOption) {
    const options = recursiveMerge<any>({}, WebpackModule.getBaseSassOptions(), {
      sassOptions: {
        indentedSyntax: true
      }
    }, sassLoaderOption)
    return WebpackModule.getLoader('sass-loader', options)
  }

  static getScssLoader (sassLoaderOption) {
    const options = recursiveMerge({}, WebpackModule.getBaseSassOptions(), sassLoaderOption)
    return WebpackModule.getLoader('sass-loader', options)
  }

  static getLessLoader (options) {
    return WebpackModule.getLoader('less-loader', options)
  }

  static getStylusLoader (options) {
    return WebpackModule.getLoader('stylus-loader', options)
  }

  static getResolveUrlLoader (options = {}) {
    return WebpackModule.getLoader('resolve-url-loader', options)
  }

  static getScriptRule () {
    return {
      test: REG_SCRIPTS,
      use: {
        babelLoader: WebpackModule.getLoader('babel-loader', {
          compact: false
        })
      }
    }
  }

  static getMediaRule (sourceRoot: string, options) {
    return {
      test: REG_MEDIA,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: options.limit || 10 * 1024 // 10kb
        }
      },
      generator: {
        outputPath: options.outputPath,
        publicPath: options.publicPath,
        filename ({ filename }) {
          if (isFunction(options.name)) return options.name(filename)
          return options.name || filename.replace(sourceRoot + '/', '')
        }
      }
    }
  }

  static getFontRule (sourceRoot: string, options) {
    return {
      test: REG_FONT,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: options.limit || 10 * 1024 // 10kb
        }
      },
      generator: {
        outputPath: options.outputPath,
        publicPath: options.publicPath,
        filename ({ filename }) {
          if (isFunction(options.name)) return options.name(filename)
          return options.name || filename.replace(sourceRoot + '/', '')
        }
      }
    }
  }

  static getImageRule (sourceRoot: string, options) {
    return {
      test: REG_IMAGE,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: options.limit || 2 * 1024 // 2kb
        }
      },
      generator: {
        outputPath: options.outputPath,
        publicPath: options.publicPath,
        filename ({ filename }) {
          if (isFunction(options.name)) return options.name(filename)
          return options.name || filename.replace(sourceRoot + '/', '')
        }
      }
    }
  }
}
