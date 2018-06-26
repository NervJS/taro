import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration;

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration;
export interface BuildConfig {
  defineConstants?: object;
  designWidth: number;
  entry: webpack.Entry;
  isWatch: boolean;
  outputRoot: string;
  publicPath: string;
  sourceRoot: string;
  staticDirectory?: string;
  env?: object;
  sourceMap?: boolean;
  plugins?: {
    babel?;
    csso?;
    typescript?;
  };
  devServer?: webpackDevServer.Configuration;
  webpack?: CustomWebpackConfig;
  date?: string;
  module?: {
    base64?: {
      imageLimit?: number;
      fontLimit?: number;
    };
    compress?: {
      css?: boolean;
      js?: boolean;
    };
  };
};
