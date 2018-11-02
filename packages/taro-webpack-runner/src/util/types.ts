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
  cssModules?: TogglableOptions;
}

export interface Chain {
  [key: string]: any;
}

export interface TaroH5Config {

  webpack: ((webpackConfig: webpack.Configuration, webpack) => webpack.Configuration) | webpack.Configuration

  webpackChain: (chain: any, webpack: any) => void;

  alias: Option;
  entry: webpack.Entry;
  output: webpack.Output;
  router?: {
    mode?: 'hash' | 'browser';
    custouRoutes?: Option;
  },
  devServer: webpackDevServer.Configuration;
  enableSourceMap: boolean;
  enableExtract: boolean;
  enableDll: boolean;

  cssLoaderOption: Option;
  styleLoaderOption: Option;
  sassLoaderOption: Option;
  lessLoaderOption: Option;
  stylusLoaderOption: Option;
  mediaUrlLoaderOption: Option;
  fontUrlLoaderOption: Option;
  imageUrlLoaderOption: Option;
  miniCssExtractPluginOption: Option;
  dllDirectory: string;
  dllFilename: string;
  dllEntry: {
    [key: string]: string[];
  };
  esnextModules: string[];

  module?: {
    postcss?: PostcssOption;
  };
}

export interface TaroPlugins {
  babel: Option;
  csso?: TogglableOptions;
  uglify?: TogglableOptions
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

  plugins: TaroPlugins;
}

export interface BuildConfig extends TaroBaseConfig, TaroH5Config {
  isWatch: boolean;
};
