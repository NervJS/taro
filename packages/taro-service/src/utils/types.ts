import { PluginType } from './constants'

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