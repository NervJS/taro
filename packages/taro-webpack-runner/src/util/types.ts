import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration;

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration;
export interface Option {
  [key: string]: any;
};

type TogglableOptions = {
  enable: boolean,
  config: Option
}

export interface PostcssOption {
  autoprefixer?: TogglableOptions;
  pxtransform?: TogglableOptions;
  plugins?: any[];
}

export interface Chain {
  [key: string]: any;
}

export interface TaroH5Config {

  webpack: ((webpackConfig: webpack.Configuration, webpack) => webpack.Configuration) | webpack.Configuration

  webpackChain: (chain: any, webpack: any) => void;

  alias: Option;
  entry: webpack.Entry;
  devServer: webpackDevServer.Configuration;
  enableSourceMap: boolean;
  enableExtract: boolean;

  cssLoaderOption: Option;
  styleLoaderOption: Option;
  sassLoaderOption: Option;
  lessLoaderOption: Option;
  stylusLoaderOption: Option;
  mediaUrlLoaderOption: Option;
  fontUrlLoaderOption: Option;
  imageUrlLoaderOption: Option;
  miniCssExtractPluginOption: Option;

  module?: {
    postcss?: PostcssOption;
  };
}

export interface TaroBaseConfig {
  sourceRoot: string;
  outputRoot: string;
  publicPath: string;
  staticDirectory: string;
  chunkDirectory: string;

  designWidth: number;
  deviceRatio?: number;

  defineConstants?: Option;
  env?: Option;

  plugins?: {
    babel?: Option;
    csso?: TogglableOptions;
    uglify?: TogglableOptions
  };
}

export interface BuildConfig extends TaroBaseConfig, TaroH5Config {
  isWatch: boolean;
};
