import { recursiveMerge, REG_SCRIPTS, REG_MEDIA, REG_FONT, REG_IMAGE, REG_VUE } from '@tarojs/helper'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { partial } from 'lodash'
import { mapKeys, pipe } from 'lodash/fp'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { join, resolve } from 'path'
import * as TerserPlugin from 'terser-webpack-plugin'
import * as webpack from 'webpack'
import { PostcssOption, IPostcssOption, ICopyOptions } from '@tarojs/taro/types/compile'

import MainPlugin from '../plugins/MainPlugin'
import { getPostcssPlugins } from '../config/postcss.conf'
import { Option } from './types'

const defaultTerserOption = {
  keep_fnames: true,
  output: {
    comments: false,
    keep_quoted_props: true,
    quote_keys: true,
    beautify: false
  },
  warnings: false
}
const defaultCSSCompressOption = {
  mergeRules: false,
  mergeIdents: false,
  reduceIdents: false,
  discardUnused: false,
  minifySelectors: false
}
const defaultMediaUrlLoaderOption = {
  limit: 10240
}
const defaultFontUrlLoaderOption = {
  limit: 10240
}
const defaultImageUrlLoaderOption = {
  limit: 10240
}
const defaultCssModuleOption: PostcssOption.cssModules = {
  enable: false,
  config: {
    namingPattern: 'global',
    generateScopedName: '[name]__[local]___[hash:base64:5]'
  }
}

const getLoader = (loaderName: string, options: Option) => {
  return {
    loader: require.resolve(loaderName),
    options: options || {}
  }
}

const listify = listOrItem => {
  if (Array.isArray(listOrItem)) {
    return listOrItem
  }
  return [listOrItem]
}

const getPlugin = (plugin: any, args: Option[]) => {
  return {
    plugin,
    args
  }
}

export const DEFAULT_Components = new Set<string>([
  'view',
  'scroll-view',
  'swiper',
  'cover-view',
  'cover-image',
  'icon',
  'text',
  'rich-text',
  'progress',
  'button',
  'checkbox',
  'form',
  'input',
  'label',
  'picker',
  'picker-view',
  'picker-view-column',
  'radio',
  'radio-group',
  'checkbox-group',
  'slider',
  'switch',
  'textarea',
  'navigator',
  'audio',
  'image',
  'video',
  'camera',
  'live-player',
  'live-pusher',
  'map',
  'canvas',
  'open-data',
  'web-view',
  'swiper-item',
  'movable-area',
  'movable-view',
  'functional-page-navigator',
  'ad',
  'block',
  'import',
  'official-account',
  'editor'
])

const mergeOption = ([...options]: Option[]): Option => {
  return recursiveMerge({}, ...options)
}

export const processEnvOption = partial(mapKeys as any, key => `process.env.${key}`) as any

const getStyleLoader = pipe(
  mergeOption,
  partial(getLoader, 'style-loader')
)
const getCssLoader = pipe(
  mergeOption,
  partial(getLoader, 'css-loader')
)
const getPostcssLoader = pipe(
  mergeOption,
  partial(getLoader, 'postcss-loader')
)
const getBabelLoader = pipe(
  mergeOption,
  partial(getLoader, 'babel-loader')
)
const getVueLoader = pipe(
  mergeOption,
  partial(getLoader, 'vue-loader')
)

const getUrlLoader = pipe(
  mergeOption,
  partial(getLoader, 'url-loader')
)
const getExtractCssLoader = () => {
  return {
    loader: MiniCssExtractPlugin.loader
  }
}

export const getMiniCssExtractPlugin = pipe(
  mergeOption,
  listify,
  partial(getPlugin, MiniCssExtractPlugin)
)
export const getHtmlWebpackPlugin = pipe(
  mergeOption,
  listify,
  partial(getPlugin, HtmlWebpackPlugin)
)
export const getDefinePlugin = pipe(
  mergeOption,
  listify,
  partial(getPlugin, webpack.DefinePlugin)
)
export const getHotModuleReplacementPlugin = partial(getPlugin, webpack.HotModuleReplacementPlugin, [])
export const getTerserPlugin = ([enableSourceMap, terserOptions]) => {
  return new TerserPlugin({
    cache: true,
    parallel: true,
    sourceMap: enableSourceMap,
    terserOptions: recursiveMerge({}, defaultTerserOption, terserOptions)
  })
}
export const getCssoWebpackPlugin = ([cssoOption]) => {
  return pipe(
    mergeOption,
    listify,
    partial(getPlugin, CssoWebpackPlugin)
  )([defaultCSSCompressOption, cssoOption])
}
export const getCopyWebpackPlugin = ({ copy, appPath }: { copy: ICopyOptions; appPath: string }) => {
  const args = [
    copy.patterns.map(({ from, to }) => {
      return {
        from,
        to: resolve(appPath, to),
        context: appPath
      }
    }),
    copy.options
  ]
  return partial(getPlugin, CopyWebpackPlugin)(args)
}

export const getMainPlugin = args => {
  return partial(getPlugin, MainPlugin)([args])
}

const isNodeModule = (filename: string) => /\bnode_modules\b/.test(filename)
const taroModuleRegs = [/@tarojs[/\\_]components/, /\btaro-components\b/]
const isTaroModule = (filename: string) => taroModuleRegs.some(reg => reg.test(filename))
const defaultEsnextModuleRegs = [
  /@tarojs[/\\_]components/,
  /\btaro-components\b/,
  /@tarojs[/\\_]taro-h5/,
  /\btaro-h5\b/,
  /@tarojs[/\\_]router/,
  /\btaro-router\b/,
  /@tarojs[/\\_]redux-h5/,
  /\btaro-redux-h5\b/,
  /@tarojs[/\\_]mobx-h5/,
  /\btaro-mobx-h5\b/
]

const getEsnextModuleRules = esnextModules => {
  return [...defaultEsnextModuleRegs, ...esnextModules]
}

export const getModule = (appPath: string, {
  staticDirectory,
  designWidth,
  deviceRatio,
  enableExtract,
  enableSourceMap,

  styleLoaderOption,
  cssLoaderOption,
  fontUrlLoaderOption,
  imageUrlLoaderOption,
  mediaUrlLoaderOption,
  esnextModules = [] as (string | RegExp)[],

  postcss,
  framework
}, chain) => {
  const postcssOption: IPostcssOption = postcss || {}

  const defaultStyleLoaderOption = {
    /**
     * 移除singleton设置，会导致样式库优先级发生错误
     * singleton: true
     */
  }

  const styleExtRegs = [/\.css$/]
  const rules = chain.module.rules.entries()
  if (rules) {
    Object.keys(rules).forEach(item => {
      if (/^addChainStyle/.test(item) && rules[item].get('test')) {
        styleExtRegs.push(rules[item].get('test'))
      }
    })
  }
  const styleReg = new RegExp(styleExtRegs.map(reg => new RegExp(reg).source).join('|'))

  const styleModuleReg = new RegExp(`(.*\.module).*${styleReg.source}`)
  const styleGlobalReg = new RegExp(`(.*\.global).*${styleReg.source}`)

  const cssModuleOptions: PostcssOption.cssModules = recursiveMerge(
    {},
    defaultCssModuleOption,
    postcssOption.cssModules
  )

  const { namingPattern, generateScopedName } = cssModuleOptions.config!

  const cssOptions = [
    {
      importLoaders: 1,
      sourceMap: enableSourceMap,
      modules: false
    },
    cssLoaderOption
  ]
  const cssOptionsWithModule = [
    Object.assign(
      {
        importLoaders: 1,
        sourceMap: enableSourceMap,
        modules: {
          mode: namingPattern === 'module' ? 'local' : 'global'
        }
      },
      {
        modules: typeof generateScopedName === 'function'
          ? { getLocalIdent: (context, _, localName) => generateScopedName(localName, context.resourcePath) }
          : { localIdentName: generateScopedName }
      }
    ),
    cssLoaderOption
  ]
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

  const styleLoader = getStyleLoader([defaultStyleLoaderOption, styleLoaderOption])
  const topStyleLoader = getStyleLoader([defaultStyleLoaderOption, {
    insert: function insertAtTop (element) {
      const parent = document.querySelector('head')
      if (parent) {
        const lastInsertedElement = (window as any)._lastElementInsertedByStyleLoader
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
  }, styleLoaderOption])

  const extractCssLoader = getExtractCssLoader()

  const lastStyleLoader = enableExtract && framework !== 'vue' ? extractCssLoader : styleLoader

  /**
   * css-loader 1.0.0版本移除了minimize选项...升级需谨慎
   *
   * https://github.com/webpack-contrib/css-loader/releases/tag/v1.0.0
   */
  const cssLoader = getCssLoader(cssOptions)
  const cssLoaders: {
    include?
    use
  }[] = [
    {
      use: [cssLoader]
    }
  ]

  if (cssModuleOptions.enable) {
    const cssLoaderWithModule = getCssLoader(cssOptionsWithModule)
    let cssModuleCondition

    if (cssModuleOptions.config!.namingPattern === 'module') {
      /* 不排除 node_modules 内的样式 */
      cssModuleCondition = styleModuleReg
    } else {
      cssModuleCondition = {
        and: [{ exclude: styleGlobalReg }, { exclude: [isNodeModule] }]
      }
    }
    cssLoaders.unshift({
      include: [cssModuleCondition],
      use: [cssLoaderWithModule]
    })
  }

  const postcssLoader = getPostcssLoader([
    { sourceMap: enableSourceMap },
    {
      ident: 'postcss',
      plugins: getPostcssPlugins(appPath, {
        designWidth,
        deviceRatio,
        postcssOption
      })
    }
  ])

  const rule: {
    [key: string]: any
  } = {}

  rule.taroStyle = {
    test: styleReg,
    use: [topStyleLoader],
    include: [(filename: string) => isTaroModule(filename)]
  }
  rule.customStyle = {
    test: styleReg,
    use: [lastStyleLoader],
    exclude: [(filename: string) => isTaroModule(filename)]
  }
  rule.css = {
    test: styleReg,
    oneOf: cssLoaders
  }
  rule.postcss = {
    test: styleReg,
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
  rule.vue = {
    test: REG_VUE,
    use: {
      vueLoader: getVueLoader([{
        transformAssetUrls: {
          video: ['src', 'poster'],
          'live-player': 'src',
          audio: 'src',
          source: 'src',
          image: 'src',
          'cover-image': 'src',
          'taro-video': ['src', 'poster'],
          'taro-live-player': 'src',
          'taro-audio': 'src',
          'taro-source': 'src',
          'taro-image': 'src',
          'taro-cover-image': 'src'
        },
        compilerOptions: {
          modules: [{
            preTransformNode (el) {
              if (DEFAULT_Components.has(el.tag)) {
                el.tag = 'taro-' + el.tag
              }
              return el
            }
          }]
        }
      }])
    }
  }
  rule.script = {
    test: REG_SCRIPTS,
    exclude: [filename => /@tarojs\/components/.test(filename) || (/node_modules/.test(filename) && !(/taro/.test(filename)))],
    use: {
      babelLoader: getBabelLoader([{
        compact: false
      }])
    }
  }
  rule.media = {
    test: REG_MEDIA,
    use: {
      urlLoader: getUrlLoader([
        defaultMediaUrlLoaderOption,
        {
          name: `${staticDirectory}/media/[name].[ext]`,
          ...mediaUrlLoaderOption
        }
      ])
    }
  }
  rule.font = {
    test: REG_FONT,
    use: {
      urlLoader: getUrlLoader([
        defaultFontUrlLoaderOption,
        {
          name: `${staticDirectory}/fonts/[name].[ext]`,
          ...fontUrlLoaderOption
        }
      ])
    }
  }
  rule.image = {
    test: REG_IMAGE,
    use: {
      urlLoader: getUrlLoader([
        defaultImageUrlLoaderOption,
        {
          name: `${staticDirectory}/images/[name].[ext]`,
          ...imageUrlLoaderOption
        }
      ])
    }
  }

  return { rule }
}

export const getOutput = (appPath: string, [{ outputRoot, publicPath, chunkDirectory }, customOutput]) => {
  return {
    path: join(appPath, outputRoot),
    filename: 'js/[name].js',
    chunkFilename: `${chunkDirectory}/[name].js`,
    publicPath,
    ...customOutput
  }
}

export const getDevtool = enableSourceMap => {
  return enableSourceMap ? 'cheap-module-eval-source-map' : 'none'
}
