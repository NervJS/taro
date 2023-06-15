import {
  chalk,
  fs,
  isNodeModule,
  recursiveMerge,
  REG_CSS,
  REG_FONT,
  REG_IMAGE,
  REG_LESS,
  REG_MEDIA,
  REG_SASS_SASS,
  REG_SASS_SCSS,
  REG_SCRIPTS,
  REG_STYLE,
  REG_STYLUS,
  REG_TEMPLATE,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import { cloneDeep, partial } from 'lodash'
import { mapKeys, pipe } from 'lodash/fp'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as path from 'path'
import * as sass from 'sass'
import * as TerserPlugin from 'terser-webpack-plugin'
import * as webpack from 'webpack'

import defaultTerserOptions from '../config/terserOptions'
import BuildNativePlugin from '../plugins/BuildNativePlugin'
import MiniPlugin from '../plugins/MiniPlugin'
import MiniSplitChunksPlugin from '../plugins/MiniSplitChunksPlugin'
import { getPostcssPlugins } from './postcss.conf'

import type { ICopyOptions, IPostcssOption, PostcssOption } from '@tarojs/taro/types/compile'
import type { IBuildConfig, IOption } from '../utils/types'

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
    sassLoaderOption,
    frameworkExts: buildConfig.frameworkExts || SCRIPT_EXT
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
  limit: 10240,
  esModule: false
}
const defaultFontUrlLoaderOption = {
  limit: 10240,
  esModule: false
}
const defaultImageUrlLoaderOption = {
  limit: 2046,
  esModule: false
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
export const getMiniTemplateLoader = pipe(mergeOption, partial(getLoader, path.resolve(__dirname, '../loaders/miniTemplateLoader')))
export const getResolveUrlLoader = pipe(mergeOption, partial(getLoader, 'resolve-url-loader'))

const getExtractCssLoader = () => {
  return {
    loader: MiniCssExtractPlugin.loader
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
  } as TerserPlugin.BasePluginOptions)
}
export const getCssoWebpackPlugin = ([cssoOption]) => {
  return pipe(listify, partial(getPlugin, CssoWebpackPlugin))([mergeOption([defaultCSSCompressOption, cssoOption]), REG_STYLE])
}
export const getCopyWebpackPlugin = ({ copy, appPath }: {
  copy: ICopyOptions
  appPath: string
}) => {
  const args = [
    copy.patterns.map(({ from, to, ...extra }) => {
      return {
        from,
        to: path.resolve(appPath, to),
        context: appPath,
        ...extra
      }
    }),
    copy.options
  ]
  return partial(getPlugin, CopyWebpackPlugin)(args)
}

export const getMiniPlugin = args => {
  return partial(getPlugin, MiniPlugin)([args])
}

export const getMiniSplitChunksPlugin = (args) => {
  return partial(getPlugin, MiniSplitChunksPlugin)([args])
}

export const getBuildNativePlugin = args => {
  return partial(getPlugin, BuildNativePlugin)([args])
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
  const miniTemplateLoader = getMiniTemplateLoader([{
    buildAdapter
  }])

  const cssLoader = getCssLoader(cssOptions)

  const baseSassOptions = {
    sourceMap: true,
    implementation: sass,
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

  const sassLoader = getSassLoader([baseSassOptions, {
    sassOptions: {
      indentedSyntax: true
    }
  }, sassLoaderOption])
  const scssLoader = getSassLoader([baseSassOptions, sassLoaderOption])

  const resolveUrlLoader = getResolveUrlLoader([{}])

  const postcssLoader = getPostcssLoader([
    { sourceMap: enableSourceMap },
    {
      postcssOptions: {
        plugins: getPostcssPlugins(appPath, {
          isBuildQuickapp,
          designWidth,
          deviceRatio,
          postcssOption
        })
      }
    }
  ])

  const lessLoader = getLessLoader([{ sourceMap: enableSourceMap }, lessLoaderOption])

  const stylusLoader = getStylusLoader([{ sourceMap: enableSourceMap }, stylusLoaderOption])

  const cssLoaders: {
    include?
    resourceQuery?
    use
  }[] = [{
    use: [
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
      // for vue
      cssLoaders.unshift({
        resourceQuery: /module=/,
        use: [
          extractCssLoader,
          cssLoaderWithModule,
          postcssLoader
        ]
      })
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

  function addCssLoader (cssLoaders, ...loader) {
    const cssLoadersCopy = cloneDeep(cssLoaders)
    cssLoadersCopy.forEach(item => {
      if (item.use) {
        item.use = [...item.use, ...loader]
      }
    })
    return cssLoadersCopy
  }

  const scriptRule: IRule = {
    test: REG_SCRIPTS,
    use: {
      babelLoader: {
        loader: require.resolve('babel-loader')
      }
    }
  }

  if (compile.exclude && compile.exclude.length) {
    scriptRule.exclude = [
      ...compile.exclude,
      filename => /css-loader/.test(filename) || (/node_modules/.test(filename) && !(/taro/.test(filename)))
    ]
  } else if (compile.include && compile.include.length) {
    scriptRule.include = [
      ...compile.include,
      sourceDir,
      filename => /taro/.test(filename)
    ]
  } else {
    scriptRule.exclude = [filename => /css-loader/.test(filename) || (/node_modules/.test(filename) && !(/taro/.test(filename)))]
  }

  const rule: Record<string, IRule> = {
    sass: {
      test: REG_SASS_SASS,
      oneOf: addCssLoader(cssLoaders, resolveUrlLoader, sassLoader)
    },
    scss: {
      test: REG_SASS_SCSS,
      oneOf: addCssLoader(cssLoaders, resolveUrlLoader, scssLoader)
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
  let pluginMainEntry
  Object.keys(pluginConfig).forEach(key => {
    if (key === 'main') {
      const filePath = path.join(pluginDir, pluginConfig[key])
      const fileName = path.basename(filePath).replace(path.extname(filePath), '')
      pluginMainEntry = `plugin/${fileName}`
      entryObj[pluginMainEntry] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
    } else if (key === 'publicComponents' || key === 'pages') {
      Object.keys(pluginConfig[key]).forEach(subKey => {
        const filePath = path.join(pluginDir, pluginConfig[key][subKey])
        entryObj[`plugin/${pluginConfig[key][subKey]}`] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
      })
    }
  })
  return {
    entry: entryObj,
    pluginConfig,
    pluginMainEntry
  }
}

export function getOutput (appPath: string, [{ outputRoot, publicPath, globalObject }, customOutput]) {
  return {
    path: path.resolve(appPath, outputRoot),
    publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    globalObject,
    ...customOutput
  }
}

export function getDevtool (enableSourceMap, sourceMapType = 'cheap-module-source-map') {
  return enableSourceMap ? sourceMapType : 'none'
}

export function getRuntimeConstants (runtime) {
  const constants: Record<string, boolean> = {}

  constants.ENABLE_INNER_HTML = runtime.enableInnerHTML ?? true

  constants.ENABLE_ADJACENT_HTML = runtime.enableAdjacentHTML ?? false

  constants.ENABLE_SIZE_APIS = runtime.enableSizeAPIs ?? false

  constants.ENABLE_TEMPLATE_CONTENT = runtime.enableTemplateContent ?? false

  constants.ENABLE_CLONE_NODE = runtime.enableCloneNode ?? false

  constants.ENABLE_CONTAINS = runtime.enableContains ?? false

  constants.ENABLE_MUTATION_OBSERVER = runtime.enableMutationObserver ?? false

  return constants
}
