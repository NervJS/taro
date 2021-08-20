/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as webpack from 'webpack'
import { IProjectBaseConfig, IH5Config } from '@tarojs/taro/types/compile'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration
export interface Option {
  [key: string]: any
}

export interface Chain {
  [key: string]: any
}

export type Func = (...args: any[]) => void

export interface BuildConfig extends IProjectBaseConfig, IH5Config {
  isWatch: boolean;
  port?: number;
  entryFileName?: string;
  modifyWebpackChain: Func;
  modifyMiniConfigs: Func;
  modifyBuildAssets: Func;
  onWebpackChainReady: Func;
  onBuildFinish: Func;
}
