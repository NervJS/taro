import CssoWebpackPlugin from 'csso-webpack-plugin';
import * as HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { partial } from 'lodash';
import { fromPairs, map, mapKeys, pipe, toPairs } from 'lodash/fp';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as webpack from 'webpack';

import { appPath, recursiveMerge } from '.';
import { getPostcssPlugins } from '../config/postcss.conf';
import { Option, PostcssOption } from './types';

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
  plugins: [
    require.resolve('babel-plugin-syntax-dynamic-import'),
    [
      require.resolve('babel-plugin-transform-react-jsx'),
      {
        pragma: 'Nerv.createElement'
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

const toArray = arg => [arg]

const getPlugin = (plugin: any, args: Option[]) => {
  return {
    plugin,
    args
  }
}

const mergeOption = ([...options]: Option[]): Option => {
  return recursiveMerge({}, ...options)
}

const getDllContext = (outputRoot, dllDirectory) => {
  return path.join(appPath, outputRoot, dllDirectory)
}
const getNamedDllContext = (outputRoot, dllDirectory, name) => {
  return {
    context: path.join(appPath, outputRoot, dllDirectory),
    name
  }
}

const processDllOption = context => {
  return {
    path: path.join(context, '[name]-manifest.json'),
    name: '[name]_library',
    context
  }
}

const processDllReferenceOption = ({ context, name }) => {
  return {
    context,
    manifest: path.join(context, `${name}-manifest.json`)
  }
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
const getExtractCssLoader = () => {
  return {
    loader: MiniCssExtractPlugin.loader
  }
}

const getMiniCssExtractPlugin = pipe(mergeOption, toArray, partial(getPlugin, MiniCssExtractPlugin))
const getHtmlWebpackPlugin = pipe(mergeOption, toArray, partial(getPlugin, HtmlWebpackPlugin))
const getDefinePlugin = pipe(mergeOption, toArray, partial(getPlugin, webpack.DefinePlugin))
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
  return pipe(mergeOption, toArray, partial(getPlugin, CssoWebpackPlugin))([defaultCSSCompressOption, cssoOption])
}
const getDllPlugin = pipe(getDllContext, processDllOption, toArray, partial(getPlugin, webpack.DllPlugin))
const getDllReferencePlugin = pipe(getNamedDllContext, processDllReferenceOption, toArray, partial(getPlugin, webpack.DllReferencePlugin))
const getHtmlWebpackIncludeAssetsPlugin = pipe(toArray, partial(getPlugin, HtmlWebpackIncludeAssetsPlugin))

const getEntry = (customEntry = {}) => {
  return Object.assign(
    {
      app: path.join('.temp', 'app.js')
    },
    customEntry
  )
}

const getModule = ({
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
  esnextModules = [] as string[],

  module,
  plugins
}) => {
  
  const postcssOption: PostcssOption = module.postcss || {}

  const styleLoader = getStyleLoader([{ sourceMap: enableSourceMap }, styleLoaderOption])

  const extractCssLoader = getExtractCssLoader()

  const lastStyleLoader = enableExtract ? extractCssLoader : styleLoader

  const cssModuleOptions: PostcssOption.cssModules = recursiveMerge({}, defaultCssModuleOption, postcssOption.cssModules)

  const cssOptions = [
    {
      importLoaders: 1,
      sourceMap: enableSourceMap,
      modules: false
    },
    cssLoaderOption
  ]
  const cssOptionsWithModule = [
    {
      importLoaders: 1,
      sourceMap: enableSourceMap,
      modules: cssModuleOptions.config!.namingPattern === 'module' ? true : 'global',
      localIdentName: cssModuleOptions.config!.generateScopedName
    },
    cssLoaderOption
  ]
  /**
   * css-loader 1.0.0版本移除了minimize选项...升级需谨慎
   *
   * https://github.com/webpack-contrib/css-loader/releases/tag/v1.0.0
   */
  const cssLoader = getCssLoader(cssOptions)
  const cssLoaders = [{
    enforce: 'post',
    use: [lastStyleLoader, cssLoader]
  }]

  if (cssModuleOptions.enable) {
    const cssLoaderWithModule = getCssLoader(cssOptionsWithModule)
    let cssModuleConditionName
    let cssModuleCondition

    if (cssModuleOptions.config!.namingPattern === 'module') {
      cssModuleConditionName = 'include'
      cssModuleCondition = {
        and: [
          { include: /(.*\.module).*\.(css|s[ac]ss|less|styl)\b/},
          { exclude: /\bnode_modules\b/ }
        ]
      }
    } else {
      cssModuleConditionName = 'include'
      cssModuleCondition = {
        and: [
          { exclude: /(.*\.global).*\.(css|s[ac]ss|less|styl)\b/ },
          { exclude: /\bnode_modules\b/ }
        ]
      }
    }
    cssLoaders.unshift({
      enforce: 'post',
      [cssModuleConditionName]: [cssModuleCondition],
      use: [lastStyleLoader, cssLoaderWithModule]
    })
  }

  const postcssLoader = getPostcssLoader([
    { sourceMap: enableSourceMap },
    {
      ident: 'postcss',
      plugins: getPostcssPlugins({
        designWidth,
        deviceRatio,
        postcssOption
      })
    }
  ])

  const resolveUrlLoader = getResolveUrlLoader([])

  const sassLoader = getSassLoader([{ sourceMap: true }, sassLoaderOption])

  const lessLoader = getLessLoader([{ sourceMap: enableSourceMap }, lessLoaderOption])

  const stylusLoader = getStylusLoader([{ sourceMap: enableSourceMap }, stylusLoaderOption])

  const rule: {
    [key: string]: any
  } = {}

  rule.sass = {
    test: /\.(s[ac]ss)\b/,
    enforce: 'pre',
    use: [resolveUrlLoader, sassLoader]
  }
  rule.less = {
    test: /\.less\b/,
    enforce: 'pre',
    use: [lessLoader]
  }
  rule.styl = {
    test: /\.styl\b/,
    enforce: 'pre',
    use: [stylusLoader]
  }
  rule.postcss = {
    test: /\.(css|s[ac]ss|less|styl)\b/,
    use: [postcssLoader]
  }
  rule.style = {
    test: /\.(css|s[ac]ss|less|styl)\b/,
    oneOf: cssLoaders
  }

  rule.jsx = {
    use: {
      babelLoader: {
        options: {
          ...plugins.babel,
          sourceMap: enableSourceMap
        }
      }
    }
  }
  rule.media = {
    use: {
      urlLoader: {
        options: {
          name: `${staticDirectory}/media/[name].[ext]`,
          ...mediaUrlLoaderOption
        }
      }
    }
  }
  rule.font = {
    use: {
      urlLoader: {
        options: {
          name: `${staticDirectory}/fonts/[name].[ext]`,
          ...fontUrlLoaderOption
        }
      }
    }
  }
  rule.image = {
    use: {
      urlLoader: {
        options: {
          name: `${staticDirectory}/images/[name].[ext]`,
          ...imageUrlLoaderOption
        }
      }
    }
  }

  const isNodemodule = filename => /\bnode_modules\b/.test(filename)
  if (Array.isArray(esnextModules) && esnextModules.length) {
    const esnextModuleRegs = esnextModules.map(v => new RegExp(`node_modules[\\\\/]${v}`))
    /**
     * isEsnextModule
     * 
     * 使用正则匹配判断是否是es模块
     * 规则参考：https://github.com/webpack/webpack/blob/master/lib/RuleSet.js#L413
     */
    const isEsnextModule = filename => esnextModuleRegs.some(reg => reg.test(filename)) 
    const notTaroModules = filename => isEsnextModule(filename) ? false : isNodemodule(filename)
    /* 通过taro处理 */
    rule.jsx.exclude = [notTaroModules]
    rule.postcss.exclude = [notTaroModules]
  } else {
    rule.jsx.exclude = [isNodemodule]
    rule.postcss.exclude = [isNodemodule]
  }
  return { rule }
}

const getOutput = ([{ outputRoot, publicPath, chunkDirectory }, customOutput]) => {
  return Object.assign(
    {
      path: path.join(appPath, outputRoot),
      filename: 'js/[name].js',
      chunkFilename: `${chunkDirectory}/[name].js`,
      publicPath
    },
    customOutput
  )
}

const getDllOutput = ({ outputRoot, dllDirectory }) => {
  return {
    path: path.join(appPath, outputRoot, dllDirectory),
    filename: '[name].dll.js',
    library: '[name]_library'
  }
}

const getDevtool = enableSourceMap => {
  return enableSourceMap ? 'cheap-module-eval-source-map' : 'none'
}

const getDllReferencePlugins = ({ dllEntry, outputRoot, dllDirectory }) => {
  return pipe(
    toPairs,
    map(([key]) => {
      return [`dll${key}`, getDllReferencePlugin(outputRoot, dllDirectory, key)]
    }),
    fromPairs
  )(dllEntry)
}

export { getStyleLoader, getCssLoader, getPostcssLoader, getResolveUrlLoader, getSassLoader, getLessLoader, getStylusLoader, getExtractCssLoader, getEntry, getOutput, getMiniCssExtractPlugin, getHtmlWebpackPlugin, getDefinePlugin, processEnvOption, getHotModuleReplacementPlugin, getDllPlugin, getModule, getUglifyPlugin, getDevtool, getDllOutput, getDllReferencePlugins, getHtmlWebpackIncludeAssetsPlugin, getCssoWebpackPlugin, getBabelLoader, defaultBabelLoaderOption, getUrlLoader, defaultMediaUrlLoaderOption, defaultFontUrlLoaderOption, defaultImageUrlLoaderOption }
