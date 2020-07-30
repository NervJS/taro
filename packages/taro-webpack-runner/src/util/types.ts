import * as webpack from 'webpack'
import { IProjectBaseConfig, IH5Config } from '@tarojs/taro/types/compile'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration;

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration;
export interface Option {
  [key: string]: any;
};


export interface Chain {
  [key: string]: any;
}

export interface BuildConfig extends IProjectBaseConfig, IH5Config {
  isWatch: boolean;
  port?: number;
  homePage?: [string, string],
  modifyWebpackChain: Function,
  modifyBuildAssets: Function,
  onBuildFinish: Function
};
