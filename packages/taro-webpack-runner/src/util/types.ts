import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration;

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration;
export interface BuildConfig {
  date?: string;
  defineConstants?: object;
  designWidth: number;
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
  staticDirectory?: string;
  devServer?: webpackDevServer.Configuration;
  port?: number;
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
