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

import { PluginType } from './constants'

export interface IPaths {
  /**
   * 当前命令执行的目录，如果是 build 命令则为当前项目路径
   */
  appPath: string
  /**
   * 当前项目配置目录，如果 init 命令，则没有此路径
   */
  configPath: string
  /**
   * 当前项目源码路径
   */
  sourcePath: string
  /**
   * 当前项目输出代码路径
   */
  outputPath: string
  /**
   * 当前项目所用的 node_modules 路径
   */
  nodeModulesPath: string
}

export type Func = (...args: any[]) => any

export interface IPlugin {
  id: string
  path: string
  opts: any
  type: PluginType
  apply: Func
}

export type IPreset = IPlugin

export interface IHook {
  name: string
  plugin?: string
  fn: Func
  before?: string
  stage?: number
}

export interface ICommand extends IHook {
  alias?: string,
  optionsMap?: {
    [key: string]: string
  },
  synopsisList?: string[]
}

export interface IFileType {
  templ: string
  style: string
  script: string
  config: string
}

export interface IPlatform extends IHook {
  useConfigName?: string
}
