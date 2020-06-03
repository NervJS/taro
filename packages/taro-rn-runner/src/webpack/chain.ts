import * as fs from 'fs-extra'
import * as path from 'path'
import { ProvidePlugin } from 'webpack'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { partial } from 'lodash'
import { mapKeys, pipe } from 'lodash/fp'
import * as webpack from 'webpack'
import { PostcssOption, ICopyOptions, IPostcssOption } from '@tarojs/taro/types/compile'
import chalk from 'chalk'

import { getPostcssPlugins } from './postcss.conf'

import RNPlugin from '../plugins/RNPlugin'
import { IOption } from '../utils/types'
import { recursiveMerge, isNodeModule, resolveScriptPath } from '../utils'
import {
  REG_STYLE,
  REG_MEDIA,
  REG_FONT,
  REG_IMAGE,
  BUILD_TYPES,
  REG_SCRIPTS
} from '../utils/constants'

const StatsPlugin = require('stats-webpack-plugin')

const globalObjectMap = {
  [BUILD_TYPES.WEAPP]: 'wx',
  [BUILD_TYPES.ALIPAY]: 'my',
  [BUILD_TYPES.SWAN]: 'swan',
  [BUILD_TYPES.QQ]: 'qq',
  [BUILD_TYPES.TT]: 'tt',
  [BUILD_TYPES.JD]: 'jd',
  [BUILD_TYPES.QUICKAPP]: 'global',
  [BUILD_TYPES.RN]: 'global'
}

const defaultUglifyJsOption = {
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

const staticDirectory = 'static'

const getLoader = (loaderName: string, options: IOption) => {
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

const getPlugin = (plugin: any, args: IOption[]) => {
  return {
    plugin,
    args
  }
}

export const mergeOption = ([...options]: IOption[]): IOption => {
  return recursiveMerge({}, ...options)
}

export const processEnvOption = partial(mapKeys as any, (key: string) => `process.env.${key}`) as any

export const getCssLoader = pipe(mergeOption, partial(getLoader, 'css-loader'))
export const getPostcssLoader = pipe(mergeOption, partial(getLoader, 'postcss-loader'))
export const getUrlLoader = pipe(mergeOption, partial(getLoader, 'url-loader'))
export const getFileLoader = pipe(mergeOption, partial(getLoader, 'file-loader'))
export const getFileParseLoader = pipe(mergeOption, partial(getLoader, path.resolve(__dirname, '../loaders/fileParseLoader')))
export const getWxTransformerLoader = pipe(mergeOption, partial(getLoader, path.resolve(__dirname, '../loaders/tsTransformerLoader')))
export const getJSXToStylesSheetLoader = pipe(mergeOption, partial(getLoader, path.resolve(__dirname, '../loaders/JSXToStylesSheetLoader')))
export const getBabelLoader = pipe(mergeOption, partial(getLoader, path.resolve(__dirname, '../loaders/babelLoader')))
const getExtractCssLoader = () => {
  return {
    loader: MiniCssExtractPlugin.loader
  }
}
export const getMiniCssExtractPlugin = pipe(mergeOption, listify, partial(getPlugin, MiniCssExtractPlugin))
export const getDefinePlugin = pipe(mergeOption, listify, partial(getPlugin, webpack.DefinePlugin))

export const getCssoWebpackPlugin = ([cssoOption]) => {
  return pipe(listify, partial(getPlugin, CssoWebpackPlugin))([mergeOption([defaultCSSCompressOption, cssoOption]), REG_STYLE])
}
export const getCopyWebpackPlugin = ({copy, appPath}: {
  copy: ICopyOptions,
  appPath: string
}) => {
  const args = [
    copy.patterns.map(({from, to}) => {
      return {
        from,
        to: path.resolve(appPath, to),
        context: appPath
      }
    }),
    copy.options
  ]
  return partial(getPlugin, CopyWebpackPlugin)(args)
}

export const getProvidePlugin = (options) => {
  return partial(getPlugin, ProvidePlugin)([options])
}

export const getStatsPlugin = (path, options) => {
  return partial(getPlugin, StatsPlugin)([path, options])
}

export const getRNPlugin = args => {
  RNPlugin.init()
  return partial(getPlugin, RNPlugin)([args])
}

export const getModule = (appPath: string, {
  sourceDir,
  entry,

  designWidth,
  deviceRatio,
  buildAdapter,
  constantsReplaceList,
  enableSourceMap,

  cssLoaderOption,
  fontUrlLoaderOption,
  imageUrlLoaderOption,
  mediaUrlLoaderOption,
  postcss,
  compile,
  babel,
  alias
}, chain) => {
  const postcssOption: IPostcssOption = postcss || {}

  const cssModuleOptions: PostcssOption.cssModules = recursiveMerge({}, defaultCssModuleOption, postcssOption.cssModules)

  const {namingPattern, generateScopedName} = cssModuleOptions.config!

  // RN default convert to CSS Modules
  const cssOptions = [
    {
      importLoaders: 1,
      sourceMap: enableSourceMap,
      modules:false
    },
    cssLoaderOption
  ]
  const cssOptionsWithModule = [
    Object.assign(
      {
        importLoaders: 1,
        sourceMap: enableSourceMap,
        modules: {
          localIdentName: '[path][name]__[local]--[hash:base64:5]',
          mode: namingPattern === 'module' ? 'local' : 'global',
          getLocalIdent: (context, localIdentName, localName, options) => {
            const parse = path.parse(entry.app[0])
            // if is enrty style
            if (context.resourcePath.startsWith(path.join(parse.dir, parse.name))) {
              return localName
            }
          }
        }
      },
      {
        modules: typeof generateScopedName === 'function'
          ? {getLocalIdent: (context, _, localName) => generateScopedName(localName, context.resourcePath)}
          : {localIdentName: generateScopedName}
      }
    ),
    cssLoaderOption
  ]

  const extractCssLoader = getExtractCssLoader()

  const cssLoader = getCssLoader(cssOptions)
  const cssLoaders: {
    include?;
    use;
  }[] = [
    {
      use: [cssLoader]
    }]

  const compileExclude = compile.exclude || []
  const compileInclude = compile.include || []

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

  if (cssModuleOptions.enable) {
    const cssLoaderWithModule = getCssLoader(cssOptionsWithModule)
    let cssModuleCondition

    if (cssModuleOptions.config!.namingPattern === 'module') {
      /* 不排除 node_modules 内的样式 */
      cssModuleCondition = styleModuleReg
    } else {
      cssModuleCondition = {
        and: [
          {exclude: styleGlobalReg},
          {exclude: [isNodeModule]}
        ]
      }
    }
    cssLoaders.unshift({
      include: [cssModuleCondition],
      use: [cssLoaderWithModule]
    })
  }

  const postcssLoader = getPostcssLoader([
    {sourceMap: enableSourceMap},
    {
      ident: 'postcss',
      plugins: getPostcssPlugins(appPath, {
        designWidth,
        deviceRatio,
        postcssOption
      })
    }
  ])

  // const fileLoader = getFileLoader([
  //   {
  //     useRelativePath: true,
  //     name: `[path][name].css`,
  //     context: sourceDir
  //   }])

  const fileParseLoader = getFileParseLoader([
    {
      babel,
      alias,
      designWidth,
      deviceRatio,
      buildAdapter,
      constantsReplaceList,
      sourceDir
    }])

  const wxTransformerLoader = getWxTransformerLoader([
    {
      buildAdapter
    }])

  // @ts-ignore
  const JSXToStylesSheetLoader = getJSXToStylesSheetLoader([
    {
      buildAdapter
    }])

  const babelLoader = getBabelLoader([
    {
      babel,
      buildAdapter
    }])

  // TODO fileParseLoader
  let scriptsLoaderConf = {
    test: REG_SCRIPTS,
    use: [
      babelLoader,
      JSXToStylesSheetLoader,
      fileParseLoader,
      wxTransformerLoader
    ]
  }

  if (compileExclude && compileExclude.length) {
    scriptsLoaderConf = Object.assign({}, scriptsLoaderConf, {
      exclude: compileExclude
    })
  }

  if (compileInclude && compileInclude.length) {
    scriptsLoaderConf = Object.assign({}, scriptsLoaderConf, {
      include: compileInclude
    })
  }

  const rule: any = {
    css: {
      test: styleReg,
      oneOf: cssLoaders
    },
    // styleFiles: {
    //   test: styleReg,
    //   use: [fileLoader]
    // },
    postcss: {
      test: styleReg,
      use: [postcssLoader]
    },
    // miniCssExtractPlugin
    customStyle: {
      test: styleReg,
      enforce: 'post',
      use: [extractCssLoader]
    },
    script: scriptsLoaderConf,
    media: {
      test: REG_MEDIA,
      use: {
        urlLoader: getUrlLoader([
          defaultMediaUrlLoaderOption, {
            name: `${staticDirectory}/media/[name].[ext]`,
            ...mediaUrlLoaderOption,
            // limit: isQuickapp ? false : mediaUrlLoaderOption.limit
            limit: false
          }])
      }
    },
    font: {
      test: REG_FONT,
      use: {
        urlLoader: getUrlLoader([
          defaultFontUrlLoaderOption, {
            name: `${staticDirectory}/fonts/[name].[ext]`,
            ...fontUrlLoaderOption,
            limit: false
          }])
      }
    },
    image: {
      test: REG_IMAGE,
      use: {
        urlLoader: getUrlLoader([
          defaultImageUrlLoaderOption, {
            name: `${staticDirectory}/images/[name].[ext]`,
            ...imageUrlLoaderOption,
            limit: 8192 * 1024
          }])
      }
    }
  }

  return {rule}
}

export const getEntry = (
  {
    sourceDir,
    entry,
    isBuildPlugin
  }
) => {
  if (!isBuildPlugin) {
    return {
      entry
    }
  }
  const pluginDir = path.join(sourceDir, 'plugin')
  if (!fs.existsSync(pluginDir)) {
    console.log(chalk.red('插件目录不存在，请检查！'))
    return
  }
  const pluginConfigPath = path.join(pluginDir, 'plugin.json')
  if (!fs.existsSync(pluginConfigPath)) {
    console.log(chalk.red('缺少插件配置文件，请检查！'))
    return
  }
  const pluginConfig = fs.readJSONSync(pluginConfigPath)
  const entryObj = {}
  Object.keys(pluginConfig).forEach(key => {
    if (key === 'main') {
      const filePath = path.join(pluginDir, pluginConfig[key])
      const fileName = path.basename(filePath).replace(path.extname(filePath), '')
      entryObj[`plugin/${fileName}`] = [resolveScriptPath(filePath.replace(path.extname(filePath), ''))]
    } else if (key === 'publicComponents' || key === 'pages') {
      Object.keys(pluginConfig[key]).forEach(subKey => {
        const filePath = path.join(pluginDir, pluginConfig[key][subKey])
        entryObj[`plugin/${pluginConfig[key][subKey]}`] = [resolveScriptPath(filePath.replace(path.extname(filePath), ''))]
      })
    }
  })
  return {
    entry: entryObj,
    pluginConfig
  }
}

export function getOutput (appPath: string, [{outputRoot, publicPath, buildAdapter, isBuildPlugin}, customOutput]) {
  return {
    path: path.join(appPath, outputRoot),
    publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    globalObject: globalObjectMap[buildAdapter],
    // library:'App',
    // libraryExport: 'default',
    libraryTarget: 'commonjs2',
    ...customOutput
  }
}

export function getDevtool (enableSourceMap) {
  return enableSourceMap ? 'cheap-module-eval-source-map' : 'none'
}
