import { PluginType } from './constants'

export interface IPaths {
  appPath: string
  sourcePath: string
  outputPath: string
  nodeModulesPath: string
}

export interface IPlugin {
  id: string
  path: string
  opts: any
  type: PluginType
  apply: () => any
}

export interface IPreset extends IPlugin {}
