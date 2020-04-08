import * as apis from '@tarojs/taro-h5/dist/taroApis'
import * as Bundler from '@tarojs/plugin-sass/bundler'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import * as sass from 'sass'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { partial } from 'lodash'
import { mapKeys, pipe } from 'lodash/fp'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { join, resolve } from 'path'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import * as webpack from 'webpack'

import { recursiveMerge } from '.'
import { getPostcssPlugins } from '../config/postcss.conf'
import { BuildConfig, CopyOptions, Option, PostcssOption } from './types'

const makeConfig = async (config: BuildConfig) => {
  const plugins = config.plugins || {}
  const sassLoaderOption = config.sassLoaderOption || {}
  const sass = plugins.sass || {}

  let bundledContent = ''
  // when plugins.sass only configured resource property
  if (sass.resource && !sass.projectDirectory) {
    const { resource } = sass
    try {
      if (typeof resource === 'string') {
        const res = await Bundler(resource)
        bundledContent += res.bundledContent
      }
      if (Array.isArray(resource)) {
        for (const url of resource) {
          const res = await Bundler(url)
          bundledContent += res.bundledContent
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  // check resource & projectDirectory property
  // projectDirectory used for resolving tilde imports
  if (sass.resource && sass.projectDirectory) {
    const { resource, projectDirectory } = sass
    try {
      if (typeof resource === 'string') {
        const res = await Bundler(resource, projectDirectory)
        bundledContent += res.bundledContent
      }
      if (Array.isArray(resource)) {
        for (const url of resource) {
          const res = await Bundler(url, projectDirectory)
          bundledContent += res.bundledContent
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  if (sass.data) {
    bundledContent += sass.data
  }
  return {
    ...config,
    plugins,
    sassLoaderOption: {
      ...sassLoaderOption,
      data: sassLoaderOption.data ? `${sassLoaderOption.data}${bundledContent}` : bundledContent
    }
  }
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
const defaultBabelLoaderOption = {
  babelrc: false,
  plugins: [
    require.resolve('babel-plugin-syntax-dynamic-import'),
    [
      require.resolve('babel-plugin-transform-react-jsx'),
      {
        pragma: 'Nerv.createElement'
      }
    ],
    [
      require.resolve('babel-plugin-transform-taroapi'),
      {
        apis,
        packageName: '@tarojs/taro-h5'
      }
    ]
  ]
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
  if (Array.isArray( listOrItem )) {
    return listOrItem
  }
  return [ listOrItem ]
}

const getPlugin = (plugin: any, args: Option[]) => {
  return {
    plugin,
    args
  }
}

const mergeOption = ([...options]: Option[]): Option => {
  return recursiveMerge({}, ...options)
}

const processEnvOption = partial(mapKeys, key => `process.env.${key}`)

const getStyleLoader = pipe(mergeOption, partial(getLoader, 'style-loader'))
const getCssLoader = pipe(mergeOption, partial(getLoader, 'css-loader'))
const getPostcssLoader = pipe(mergeOption, partial(getLoader, 'postcss-loader'))
const getResolveUrlLoader = pipe(mergeOption, partial(getLoader, 'resolve-url-loader'))
const getSassLoader = pipe(mergeOption, partial(getLoader, 'sass-loader'))
const getLessLoader = pipe(mergeOption, partial(getLoader, 'less-loader'))
const getStylusLoader = pipe(mergeOption, partial(getLoader, 'stylus-loader'))
const getBabelLoader = pipe(mergeOption, partial(getLoader, 'babel-loader'))
const getUrlLoader = pipe(mergeOption, partial(getLoader, 'url-loader'))
const getExtractCssLoader = (options) => {
  return {
    loader: MiniCssExtractPlugin.loader,
    options: options || {}
  }
}

const getMiniCssExtractPlugin = pipe(mergeOption, listify, partial(getPlugin, MiniCssExtractPlugin))
const getHtmlWebpackPlugin = pipe(mergeOption, listify, partial(getPlugin, HtmlWebpackPlugin))
const getDefinePlugin = pipe(mergeOption, listify, partial(getPlugin, webpack.DefinePlugin))
const getHotModuleReplacementPlugin = partial(getPlugin, webpack.HotModuleReplacementPlugin, [])
const getUglifyPlugin = ([enableSourceMap, uglifyOptions]) => {
  return new UglifyJsPlugin({
    cache: true,
    parallel: true,
    sourceMap: enableSourceMap,
    uglifyOptions: recursiveMerge({}, defaultUglifyJsOption, uglifyOptions)
  })
}
const getCssoWebpackPlugin = ([cssoOption]) => {
  return pipe(mergeOption, listify, partial(getPlugin, CssoWebpackPlugin))([defaultCSSCompressOption, cssoOption])
}
const getCopyWebpackPlugin = ({ copy, appPath }: {
  copy: CopyOptions,
  appPath: string
}) => {
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

const sassReg = /\.(s[ac]ss)\b/
const lessReg = /\.less\b/
const stylReg = /\.styl\b/
const styleReg = /\.(css|s[ac]ss|less|styl)\b/
const styleModuleReg = /(.*\.module).*\.(css|s[ac]ss|less|styl)\b/
const styleGlobalReg = /(.*\.global).*\.(css|s[ac]ss|less|styl)\b/
const jsxReg = /\.jsx?$/
const mediaReg = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
const fontReg = /\.(woff2?|eot|ttf|otf)(\?.*)?$/
const imageReg = /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/

const isNodeModule = (filename: string) => /\bnode_modules\b/.test(filename)
const taroModuleRegs = [
  /@tarojs[/\\_]components/, /\btaro-components\b/
]
const isTaroModule = (filename: string) => taroModuleRegs.some(reg => reg.test(filename))
const defaultEsnextModuleRegs = [
  /@tarojs[/\\_]components/, /\btaro-components\b/,
  /@tarojs[/\\_]taro-h5/, /\btaro-h5\b/,
  /@tarojs[/\\_]router/, /\btaro-router\b/,
  /@tarojs[/\\_]redux-h5/, /\btaro-redux-h5\b/,
  /@tarojs[/\\_]mobx-h5/, /\btaro-mobx-h5\b/
]

const getEsnextModuleRules = esnextModules => {
   return [
    ...defaultEsnextModuleRegs,
    ...esnextModules
  ]
}

const getModule = (appPath: string, {
  staticDirectory,
  designWidth,
  deviceRatio,
  enableExtract,
  enableSourceMap,

  styleLoaderOption,
  cssLoaderOption,
  lessLoaderOption,
  sassLoaderOption,
  stylusLoaderOption,
  fontUrlLoaderOption,
  imageUrlLoaderOption,
  mediaUrlLoaderOption,
  miniCssExtractLoaderOption,
  esnextModules = [] as (string | RegExp)[],

  module,
  plugins
}) => {

  const postcssOption: PostcssOption = module.postcss || {}

  const defaultStyleLoaderOption = {
    sourceMap: enableSourceMap
    /**
     * 移除singleton设置，会导致样式库优先级发生错误
     * singleton: true
     */
  }

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
        modules: namingPattern === 'module' ? true : 'global'
      },
      typeof generateScopedName === 'function'
        ? { getLocalIdent: (context, _, localName) => generateScopedName(localName, context.resourcePath) }
        : { localIdentName: generateScopedName }
    ),
    cssLoaderOption
  ]
  const additionalBabelOptions = {
    ...plugins.babel,
    sourceMap: enableSourceMap
  }
  const esnextModuleRules = getEsnextModuleRules(esnextModules)

  /**
   * isEsnextModule
   *
   * 使用正则匹配判断是否是es模块
   * 规则参考：https://github.com/webpack/webpack/blob/master/lib/RuleSet.js#L413
   */
  const isEsnextModule = (filename: string) => esnextModuleRules.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(filename)
    } else {
      return filename.indexOf(pattern) > -1
    }
  })

  const styleLoader = getStyleLoader([
    defaultStyleLoaderOption,
    styleLoaderOption
  ])
  const topStyleLoader = getStyleLoader([
    defaultStyleLoaderOption,
    { insertAt: 'top' },
    styleLoaderOption
  ])

  const extractCssLoader = getExtractCssLoader(miniCssExtractLoaderOption)

  const lastStyleLoader = enableExtract ? extractCssLoader : styleLoader

  /**
   * css-loader 1.0.0版本移除了minimize选项...升级需谨慎
   *
   * https://github.com/webpack-contrib/css-loader/releases/tag/v1.0.0
   */
  const cssLoader = getCssLoader(cssOptions)
  const cssLoaders: {
    include?;
    use;
  }[] = [{
    use: [cssLoader]
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

  const resolveUrlLoader = getResolveUrlLoader([])

  const sassLoader = getSassLoader([{
    sourceMap: true,
    implementation: sass
  }, sassLoaderOption])

  const lessLoader = getLessLoader([{ sourceMap: enableSourceMap }, lessLoaderOption])

  const stylusLoader = getStylusLoader([{ sourceMap: enableSourceMap }, stylusLoaderOption])

  const rule: {
    [key: string]: any
  } = {}

  rule.sass = {
    test: sassReg,
    enforce: 'pre',
    use: [resolveUrlLoader, sassLoader]
  }
  rule.less = {
    test: lessReg,
    enforce: 'pre',
    use: [lessLoader]
  }
  rule.styl = {
    test: stylReg,
    enforce: 'pre',
    use: [stylusLoader]
  }
  rule.css = {
    test: styleReg,
    oneOf: cssLoaders
  }
  rule.postcss = {
    test: styleReg,
    use: [postcssLoader],
    exclude: [filename => {
      if (isTaroModule(filename)) {
        return true
      } else if (isEsnextModule(filename)) {
        return false
      } else {
        return isNodeModule(filename)
      }
    }]
  }
  rule.taroStyle = {
    test: styleReg,
    enforce: 'post',
    use: [topStyleLoader],
    include: [(filename: string) => isTaroModule(filename)]
  }
  rule.customStyle = {
    test: styleReg,
    enforce: 'post',
    use: [lastStyleLoader],
    exclude: [(filename: string) => isTaroModule(filename)]
  }
  rule.jsx = {
    test: jsxReg,
    use: {
      babelLoader: getBabelLoader([defaultBabelLoaderOption, additionalBabelOptions])
    }
  }
  rule.media = {
    test: mediaReg,
    use: {
      urlLoader: getUrlLoader([defaultMediaUrlLoaderOption, {
        name: `${staticDirectory}/media/[name].[ext]`,
        ...mediaUrlLoaderOption
      }])
    }
  }
  rule.font = {
    test: fontReg,
    use: {
      urlLoader: getUrlLoader([defaultFontUrlLoaderOption, {
        name: `${staticDirectory}/fonts/[name].[ext]`,
        ...fontUrlLoaderOption
      }])
    }
  }
  rule.image = {
    test: imageReg,
    use: {
      urlLoader: getUrlLoader([defaultImageUrlLoaderOption, {
        name: `${staticDirectory}/images/[name].[ext]`,
        ...imageUrlLoaderOption
      }])
    }
  }

  return { rule }
}

const getOutput = (appPath: string, [{ outputRoot, publicPath, chunkDirectory }, customOutput]) => {
  return {
    path: join(appPath, outputRoot),
    filename: 'js/[name].js',
    chunkFilename: `${chunkDirectory}/[name].js`,
    publicPath,
    ...customOutput
  }
}

const getDevtool = ({ enableSourceMap, sourceMapType }) => {
  return enableSourceMap ? sourceMapType || 'cheap-module-eval-source-map' : 'none'
}

export {
  isNodeModule,
  isTaroModule,
  getEsnextModuleRules,
  makeConfig
}

export { getOutput, getMiniCssExtractPlugin, getHtmlWebpackPlugin, getDefinePlugin, processEnvOption, getHotModuleReplacementPlugin, getModule, getUglifyPlugin, getDevtool, getCssoWebpackPlugin, getCopyWebpackPlugin }
