import * as fs from 'fs-extra'
import * as path from 'path'

import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as sass from 'node-sass'
import { partial, cloneDeep } from 'lodash'
import { mapKeys, pipe } from 'lodash/fp'
import * as TerserPlugin from 'terser-webpack-plugin'
import * as webpack from 'webpack'
import { PostcssOption, ICopyOptions, IPostcssOption } from '@tarojs/taro/types/compile'
import {
  recursiveMerge,
  isNodeModule,
  resolveMainFilePath,
  REG_SASS_SASS,
  REG_SASS_SCSS,
  REG_LESS,
  REG_STYLUS,
  REG_STYLE,
  REG_MEDIA,
  REG_FONT,
  REG_IMAGE,
  REG_SCRIPTS,
  REG_CSS,
  REG_TEMPLATE,
  chalk
} from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'

import { getPostcssPlugins } from './postcss.conf'

import MiniPlugin from '../plugins/MiniPlugin'
import { IOption, IBuildConfig } from '../utils/types'
import defaultTerserOptions from '../config/terserOptions'

interface IRule {
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

export const makeConfig = async (buildConfig: IBuildConfig) => {
  const sassLoaderOption = await getSassLoaderOption(buildConfig)
  return {
    ...buildConfig,
    sassLoaderOption
  }
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
  limit: 2046
}
const defaultCssModuleOption: PostcssOption.cssModules = {
  enable: false,
  config: {
    namingPattern: 'global',
    generateScopedName: '[name]__[local]___[hash:base64:5]'
  }
}

const defaultUrlOption: PostcssOption.url = {
  enable: true,
  config: {
    limit: 10240 // limit 10k base on document
  }
}

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

const styleModuleReg = /(.*\.module).*\.(css|s[ac]ss|less|styl)\b/
const styleGlobalReg = /(.*\.global).*\.(css|s[ac]ss|less|styl)\b/

export const processEnvOption = partial(mapKeys as any, (key: string) => `process.env.${key}`) as any

export const getCssLoader = pipe(mergeOption, partial(getLoader, 'css-loader'))
export const getPostcssLoader = pipe(mergeOption, partial(getLoader, 'postcss-loader'))
export const getSassLoader = pipe(mergeOption, partial(getLoader, 'sass-loader'))
export const getLessLoader = pipe(mergeOption, partial(getLoader, 'less-loader'))
export const getStylusLoader = pipe(mergeOption, partial(getLoader, 'stylus-loader'))
export const getUrlLoader = pipe(mergeOption, partial(getLoader, 'url-loader'))
export const getFileLoader = pipe(mergeOption, partial(getLoader, 'file-loader'))
export const getBabelLoader = pipe(mergeOption, partial(getLoader, 'babel-loader'))
export const getMiniTemplateLoader = pipe(mergeOption, partial(getLoader, path.resolve(__dirname, '../loaders/miniTemplateLoader')))

const getExtractCssLoader = () => {
  return {
    loader: MiniCssExtractPlugin.loader
  }
}
const getQuickappStyleLoader = () => {
  return {
    loader: require.resolve(path.resolve(__dirname, '../loaders/quickappStyleLoader'))
  }
}
export const getMiniCssExtractPlugin = pipe(mergeOption, listify, partial(getPlugin, MiniCssExtractPlugin))
export const getDefinePlugin = pipe(mergeOption, listify, partial(getPlugin, webpack.DefinePlugin))
export const getTerserPlugin = ([enableSourceMap, terserOptions]) => {
  return new TerserPlugin({
    cache: true,
    parallel: true,
    sourceMap: enableSourceMap,
    terserOptions: recursiveMerge({}, defaultTerserOptions, terserOptions)
  })
}
export const getCssoWebpackPlugin = ([cssoOption]) => {
  return pipe(listify, partial(getPlugin, CssoWebpackPlugin))([mergeOption([defaultCSSCompressOption, cssoOption]), REG_STYLE])
}
export const getCopyWebpackPlugin = ({ copy, appPath }: {
  copy: ICopyOptions,
  appPath: string
}) => {
  const args = [
    copy.patterns.map(({ from, to }) => {
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

export const getMiniPlugin = args => {
  return partial(getPlugin, MiniPlugin)([args])
}

export const getProviderPlugin = args => {
  return partial(getPlugin, webpack.ProvidePlugin)([args])
}

export const getModule = (appPath: string, {
  sourceDir,

  designWidth,
  deviceRatio,
  buildAdapter,
  isBuildQuickapp,
  // constantsReplaceList,
  enableSourceMap,
  compile,

  cssLoaderOption,
  lessLoaderOption,
  sassLoaderOption,
  stylusLoaderOption,
  fontUrlLoaderOption,
  imageUrlLoaderOption,
  mediaUrlLoaderOption,
  postcss,
  fileType
}) => {
  const postcssOption: IPostcssOption = postcss || {}

  const cssModuleOptions: PostcssOption.cssModules = recursiveMerge({}, defaultCssModuleOption, postcssOption.cssModules)

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
  const extractCssLoader = getExtractCssLoader()
  const quickappStyleLoader = getQuickappStyleLoader()
  const miniTemplateLoader = getMiniTemplateLoader([{
    buildAdapter
  }])

  const cssLoader = getCssLoader(cssOptions)
  const sassLoader = getSassLoader([{
    sourceMap: true,
    implementation: sass,
    sassOptions: {
      indentedSyntax: true
    }
  }, sassLoaderOption])
  const scssLoader = getSassLoader([{
    sourceMap: true,
    implementation: sass
  }, sassLoaderOption])

  const postcssLoader = getPostcssLoader([
    { sourceMap: enableSourceMap },
    {
      ident: 'postcss',
      plugins: getPostcssPlugins(appPath, {
        isBuildQuickapp,
        designWidth,
        deviceRatio,
        postcssOption
      })
    }
  ])

  const lessLoader = getLessLoader([{ sourceMap: enableSourceMap }, lessLoaderOption])

  const stylusLoader = getStylusLoader([{ sourceMap: enableSourceMap }, stylusLoaderOption])

  const cssLoaders: {
    include?;
    use;
  }[] = [{
    use: isBuildQuickapp ? [
      extractCssLoader,
      quickappStyleLoader,
      cssLoader,
      postcssLoader
    ] : [
      extractCssLoader,
      cssLoader,
      postcssLoader
    ]
  }]

  if (cssModuleOptions.enable) {
    const cssLoaderWithModule = getCssLoader(cssOptionsWithModule)
    let cssModuleCondition

    if (cssModuleOptions.config!.namingPattern === 'module') {
      /* 不排除 node_modules 内的样式 */
      cssModuleCondition = styleModuleReg
    } else {
      cssModuleCondition = {
        and: [
          { exclude: styleGlobalReg },
          { exclude: [isNodeModule] }
        ]
      }
    }
    cssLoaders.unshift({
      include: [cssModuleCondition],
      use: [
        extractCssLoader,
        cssLoaderWithModule,
        postcssLoader
      ]
    })
  }

  const urlOptions: PostcssOption.url = recursiveMerge({}, defaultUrlOption, postcssOption.url)
  let postcssUrlOption
  if (urlOptions.enable) {
    postcssUrlOption = urlOptions.config
  }

  function addCssLoader (cssLoaders, loader) {
    const cssLoadersCopy = cloneDeep(cssLoaders)
    cssLoadersCopy.forEach(item => {
      item.use && item.use.push(loader)
    })
    return cssLoadersCopy
  }

  const scriptRule: IRule = {
    test: REG_SCRIPTS,
    use: {
      babelLoader: getBabelLoader([])
    }
  }

  if (compile.exclude && compile.exclude.length) {
    scriptRule.exclude = [
      ...compile.exclude,
      filename => /node_modules/.test(filename) && !(/taro/.test(filename))
    ]
  } else if (compile.include && compile.include.length) {
    scriptRule.include = [
      ...compile.include,
      sourceDir,
      filename => /taro/.test(filename)
    ]
  } else {
    scriptRule.exclude = [filename => /node_modules/.test(filename) && !(/taro/.test(filename))]
  }

  const rule: Record<string, IRule> = {
    sass: {
      test: REG_SASS_SASS,
      oneOf: addCssLoader(cssLoaders, sassLoader)
    },
    scss: {
      test: REG_SASS_SCSS,
      oneOf: addCssLoader(cssLoaders, scssLoader)
    },
    less: {
      test: REG_LESS,
      oneOf: addCssLoader(cssLoaders, lessLoader)
    },
    stylus: {
      test: REG_STYLUS,
      oneOf: addCssLoader(cssLoaders, stylusLoader)
    },
    nomorlCss: {
      test: REG_CSS,
      oneOf: cssLoaders
    },
    script: scriptRule,
    template: {
      test: REG_TEMPLATE,
      use: [getFileLoader([{
        useRelativePath: true,
        name: `[path][name]${fileType.templ}`,
        context: sourceDir
      }]), miniTemplateLoader]
    },
    media: {
      test: REG_MEDIA,
      use: {
        urlLoader: getUrlLoader([defaultMediaUrlLoaderOption, {
          name: '[path][name].[ext]',
          useRelativePath: true,
          context: sourceDir,
          ...(postcssUrlOption || {}),
          ...mediaUrlLoaderOption
        }])
      }
    },
    font: {
      test: REG_FONT,
      use: {
        urlLoader: getUrlLoader([defaultFontUrlLoaderOption, {
          name: '[path][name].[ext]',
          useRelativePath: true,
          context: sourceDir,
          ...(postcssUrlOption || {}),
          ...fontUrlLoaderOption
        }])
      }
    },
    image: {
      test: REG_IMAGE,
      use: {
        urlLoader: getUrlLoader([defaultImageUrlLoaderOption, {
          name: '[path][name].[ext]',
          useRelativePath: true,
          context: sourceDir,
          ...(postcssUrlOption || {}),
          ...imageUrlLoaderOption
        }])
      }
    }
  }

  return { rule }
}

export const getEntry = ({
  sourceDir,
  entry,
  isBuildPlugin
}) => {
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
      entryObj[`plugin/${fileName}`] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
    } else if (key === 'publicComponents' || key === 'pages') {
      Object.keys(pluginConfig[key]).forEach(subKey => {
        const filePath = path.join(pluginDir, pluginConfig[key][subKey])
        entryObj[`plugin/${pluginConfig[key][subKey]}`] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
      })
    }
  })
  return {
    entry: entryObj,
    pluginConfig
  }
}

export function getOutput (appPath: string, [{ outputRoot, publicPath, globalObject }, customOutput]) {
  return {
    path: path.join(appPath, outputRoot),
    publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    globalObject,
    ...customOutput
  }
}

export function getDevtool (enableSourceMap) {
  return enableSourceMap ? 'source-map' : 'none'
}
