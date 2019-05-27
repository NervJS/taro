import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration;

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration;
export interface Option {
  [key: string]: any;
};

type TogglableOptions<T = Option> = {
  enable?: boolean;
  config?: T;
}

export namespace PostcssOption {
  export type cssModules = TogglableOptions<{
    namingPattern: 'global' | string;
    generateScopedName: string | ((localName: string, absoluteFilePath: string) => string);
  }>;
}

export interface PostcssOption {
  autoprefixer?: TogglableOptions;
  pxtransform?: TogglableOptions;
  cssModules?: PostcssOption.cssModules;
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
    customRoutes?: Option;
    basename?: string;
  };
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
  esnextModules: string[];

  module?: {
    postcss?: PostcssOption;
  };
}

export interface TaroPlugins {
  babel: Option;
  csso?: TogglableOptions;
  uglify?: TogglableOptions;
}

export interface CopyOptions {
  patterns: {
    from: string;
    to: string;
    ignore: string[]
  }[];
  options: {
    ignore: string[];
  };
}

export interface TaroBaseConfig {
  sourceRoot: string;
  outputRoot: string;
  publicPath: string;
  staticDirectory: string;
  chunkDirectory: string;
  copy: CopyOptions;

  designWidth: number;
  deviceRatio?: number;

  defineConstants?: Option;
  env?: Option;

  plugins: TaroPlugins;
}

export interface BuildConfig extends TaroBaseConfig, TaroH5Config {
  isWatch: boolean;
  port?: number
};
