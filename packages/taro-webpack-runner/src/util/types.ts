import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration;

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration;
export interface BuildConfig {
  date?: string;
  defineConstants?: object;
  designWidth: number;
  devtool;
  entry: webpack.Entry;
  isWatch: boolean;
  outputRoot: string;
  sourceRoot: string;
  env?: object;
  sourceMap?: boolean;
  plugins?: {
    babel?;
    csso?: {
      enable?: boolean;
      config?: object;
    };
    uglify?: {
      enable?: boolean;
      config?: object;
    }
    typescript?;
  };

  publicPath: string;
  staticDirectory: string;
  chunkDirectory: string;
  devServer?: webpackDevServer.Configuration;
  host: string;
  port: number;
  protocol: string;
  webpack?: CustomWebpackConfig;
  module?: {
    postcss?: {
      autoprefixer?: {
        enable?: boolean;
      };
      pxtransform?: {
        selectorBlackList?: any[];
      };
    }
    base64?: {
      imageLimit?: number;
      fontLimit?: number;
    };
    compress?: {
      css?: object; // css-loader - minimize
      js?: object; // uglifyjs plugin - uglifyOptions
    };
  };
};
