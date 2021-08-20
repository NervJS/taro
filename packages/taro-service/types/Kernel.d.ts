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

/// <reference types="node" />
import { EventEmitter } from 'events'
import { PluginItem, IProjectConfig } from '@tarojs/taro/types/compile'

import { IPreset, IPlugin, IPaths, IHook, ICommand, IPlatform } from '../src/utils/types'
import Plugin from './Plugin'
import Config from './Config'

interface IKernelOptions {
  appPath: string;
  presets?: PluginItem[];
  plugins?: PluginItem[];
}
export default class Kernel extends EventEmitter {
  appPath: string;
  isWatch: boolean;
  isProduction: boolean;
  optsPresets: PluginItem[];
  optsPlugins: PluginItem[];
  plugins: Map<string, IPlugin>;
  paths: IPaths;
  extraPlugins: IPlugin[];
  config: Config;
  initialConfig: IProjectConfig;
  hooks: Map<string, IHook[]>;
  methods: Map<string, Function>;
  commands: Map<string, ICommand>;
  platforms: Map<string, IPlatform>;
  helper: any;
  runOpts: any;
  debugger: any;
  constructor(options: IKernelOptions);
  init(): Promise<void>;
  initConfig(): void;
  initPaths(): void;
  initHelper(): void;
  initPresetsAndPlugins(): void;
  resolvePresets(presets: any): void;
  resolvePlugins(plugins: any): void;
  initPreset(preset: IPreset): void;
  initPlugin(plugin: IPlugin): void;
  registerPlugin(plugin: IPlugin): void;
  initPluginCtx({ id, path, ctx }: {
    id: string;
    path: string;
    ctx: Kernel;
  }): Plugin;
  applyPlugins(args: string | {
    name: string;
    initialVal?: any;
    opts?: any;
  }): Promise<any>;
  runWithPlatform(platform: any): any;
  setRunOpts(opts: any): void;
  run(args: string | {
    name: string;
    opts?: any;
  }): Promise<void>;
}
