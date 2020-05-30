import * as fs from 'fs-extra'
import * as path from 'path'

import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { partial } from 'lodash'
import { mapKeys, pipe } from 'lodash/fp'
import * as webpack from 'webpack'
import { PostcssOption, ICopyOptions, IPostcssOption } from '@tarojs/taro/types/compile'
import {
  REG_STYLE,
  REG_MEDIA,
  REG_FONT,
  REG_IMAGE,
  REG_SCRIPTS,
  REG_TEMPLATE,
  recursiveMerge,
  isNodeModule,
  resolveScriptPath,
  chalk
} from '@tarojs/helper'

import { getPostcssPlugins } from './postcss.conf'

import MiniPlugin from '../plugins/MiniPlugin'
import { IOption } from '../utils/types'

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
export const getWxTransformerLoader = pipe(mergeOption, partial(getLoader, path.resolve(__dirname, '../loaders/wxTransformerLoader')))
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
  MiniPlugin.init()
  return partial(getPlugin, MiniPlugin)([args])
}

export const getModule = (appPath: string, {
  sourceDir,
  fileType,
  isBuildQuickapp,
  isUseComponentBuildPage,

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
  alias,
  nodeModulesPath
}, chain) => {

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

  const cssLoader = getCssLoader(cssOptions)
  const cssLoaders: {
    include?;
    use;
  }[] = [{
    use: isBuildQuickapp ? [cssLoader, quickappStyleLoader] : [cssLoader]
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
          { exclude: styleGlobalReg },
          { exclude: [isNodeModule] }
        ]
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
        isBuildQuickapp,
        designWidth,
        deviceRatio,
        postcssOption
      })
    }
  ])

  const parsedConstantsReplaceList = {}
  Object.keys(constantsReplaceList).forEach(key => {
    try {
      parsedConstantsReplaceList[key] = JSON.parse(constantsReplaceList[key])
    } catch (error) {
      parsedConstantsReplaceList[key] = constantsReplaceList[key]
    }
  })
  const wxTransformerLoader = getWxTransformerLoader([{
    babel,
    alias,
    designWidth,
    deviceRatio,
    buildAdapter,
    constantsReplaceList: parsedConstantsReplaceList,
    sourceDir,
    isBuildQuickapp,
    nodeModulesPath,
    isUseComponentBuildPage
  }])

  const miniTemplateLoader = getMiniTemplateLoader([])

  let scriptsLoaderConf = {
    test: REG_SCRIPTS,
    use: [wxTransformerLoader],
  }

  if (compileExclude && compileExclude.length) {
    scriptsLoaderConf = Object.assign({}, scriptsLoaderConf, {
      exclude: [
        ...compileExclude
      ]
    })
  }

  if (compileInclude && compileInclude.length) {
    scriptsLoaderConf = Object.assign({}, scriptsLoaderConf, {
      include: [
        ...compileInclude,
        sourceDir
      ]
    })
  }

  const rule: any = {
    css: {
      test: styleReg,
      oneOf: cssLoaders
    },
    postcss: {
      test: styleReg,
      use: [postcssLoader]
    },
    customStyle: {
      test: styleReg,
      enforce: 'post',
      use: [extractCssLoader]
    },
    script: scriptsLoaderConf,
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
          name: `[path][name].[ext]`,
          useRelativePath: true,
          context: sourceDir,
          ...mediaUrlLoaderOption,
          limit: isBuildQuickapp ? false : mediaUrlLoaderOption.limit
        }])
      }
    },
    font: {
      test: REG_FONT,
      use: {
        urlLoader: getUrlLoader([defaultFontUrlLoaderOption, {
          name: `[path][name].[ext]`,
          useRelativePath: true,
          context: sourceDir,
          ...fontUrlLoaderOption,
          limit: isBuildQuickapp ? false : fontUrlLoaderOption.limit
        }])
      }
    },
    image: {
      test: REG_IMAGE,
      use: {
        urlLoader: getUrlLoader([defaultImageUrlLoaderOption, {
          name: `[path][name].[ext]`,
          useRelativePath: true,
          context: sourceDir,
          ...imageUrlLoaderOption,
          limit: isBuildQuickapp ? false : imageUrlLoaderOption.limit
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
      entryObj[pluginMainEntry] = [resolveScriptPath(filePath.replace(path.extname(filePath), ''))]
    } else if (key === 'publicComponents' || key === 'pages') {
      Object.keys(pluginConfig[key]).forEach(subKey => {
        const filePath = path.join(pluginDir, pluginConfig[key][subKey])
        entryObj[`plugin/${pluginConfig[key][subKey]}`] = [resolveScriptPath(filePath.replace(path.extname(filePath), ''))]
      })
    }
  })
  return {
    entry: entryObj,
    pluginConfig,
    pluginMainEntry,
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
  return enableSourceMap ? 'cheap-module-eval-source-map' : 'none'
}
