import { PluginType } from './constants'
import { Kernel } from 'src';
import { IProjectConfig } from '@tarojs/taro/types/compile';

export interface IPaths {
  appPath: string
  configPath: string
  sourcePath: string
  outputPath: string
  nodeModulesPath: string
}

export interface IPlugin {
  id: string
  path: string
  opts: any
  type: PluginType
  apply: Function
}

export interface IPreset extends IPlugin {}

export interface IHook {
  name: string
  plugin: string
  fn: Function
  before?: string
  stage?: number
}

export interface ICommand extends IHook {
  alias?: string
}

export interface IFileType {
  templ: string
  style: string
  script: string
  config: string
}

export interface IPlatform extends IHook {
  fileType: IFileType
  useConfigName: String
}

export interface IPluginContext {
  ctx: Kernel
  plugins: Map<string, IPlugin>
  paths: IPaths
  initialConfig: IProjectConfig
  register: (hook: IHook) => void
  registerMethod: (arg: (string | { name: string, fn?: Function }), fn?: Function) => void,
  registerCommand: (command: ICommand) => void
  registerPlatform: (platform: IPlatform) => void
}
