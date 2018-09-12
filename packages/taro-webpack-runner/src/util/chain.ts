import * as path from 'path';
import { partial } from 'lodash';
import { pipe } from 'lodash/fp';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { Option } from './types';


const getLoader = (loaderName: string, options: Option) => {
  return {
    loader: require.resolve(loaderName),
    options: options || {}
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
  return MiniCssExtractPlugin.loader
}

const appPath = process.cwd()

const getEntry = () => {
  return {
    app: path.join('.temp', 'app.js')
  }
}

const getOutput = ({ outputRoot, publicPath }) => {
  return {
    path: path.join(appPath, outputRoot),
    filename: 'js/[name].js',
    publicPath
  }
}

export { getStyleLoader, getCssLoader, getPostcssLoader, getResolveUrlLoader, getSassLoader, getLessLoader, getStylusLoader, getExtractCssLoader, getEntry, getOutput }
