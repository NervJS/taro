import * as path from 'path'
import { partial } from 'lodash'
import { pipe, mapKeys } from 'lodash/fp'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpack from 'webpack'

import { Option } from './types'

const getLoader = (loaderName: string, options: Option) => {
  return {
    loader: require.resolve(loaderName),
    options: options || {}
  }
}

const getPlugin = (plugin: any, args: Option) => {
  return {
    plugin,
    args: [args]
  }
}

const mergeOption = ([...options]: Option[]): Option => {
  return Object.assign({}, ...options)
}

const getStyleLoader = pipe(mergeOption, partial(getLoader, 'style-loader'))
const getCssLoader = pipe(mergeOption, partial(getLoader, 'css-loader'))
const getPostcssLoader = pipe(mergeOption, partial(getLoader, 'postcss-loader'))
const getResolveUrlLoader = pipe(mergeOption, partial(getLoader, 'resolve-url-loader'))
const getSassLoader = pipe(mergeOption, partial(getLoader, 'sass-loader'))
const getLessLoader = pipe(mergeOption, partial(getLoader, 'less-loader'))
const getStylusLoader = pipe(mergeOption, partial(getLoader, 'stylus-loader'))
const getExtractCssLoader = () => {
  return {
    loader: MiniCssExtractPlugin.loader
  }
}

const getMiniCssExtractPlugin = pipe(mergeOption, partial(getPlugin, MiniCssExtractPlugin))
const getHtmlWebpackPlugin = pipe(mergeOption, partial(getPlugin, HtmlWebpackPlugin))
const getDefinePlugin = pipe(mergeOption, partial(getPlugin, webpack.DefinePlugin))
const getHotModuleReplacementPlugin = pipe(mergeOption, partial(getPlugin, webpack.HotModuleReplacementPlugin))

const processEnvOption = partial(mapKeys, key => `process.env.${key}`)

const appPath = process.cwd()

const getEntry = () => {
  return {
    app: path.join('.temp', 'app.js')
  }
}

const getOutput = ({ outputRoot,  publicPath, chunkDirectory }) => {
  return {
    path: path.join(appPath, outputRoot),
    filename: 'js/[name].js',
    chunkFilename: `${chunkDirectory}/[name].js`,
    publicPath
  }
}

export { getStyleLoader, getCssLoader, getPostcssLoader, getResolveUrlLoader, getSassLoader, getLessLoader, getStylusLoader, getExtractCssLoader, getEntry, getOutput, getMiniCssExtractPlugin, getHtmlWebpackPlugin, getDefinePlugin, processEnvOption, getHotModuleReplacementPlugin } 
