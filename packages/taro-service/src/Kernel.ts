import * as path from 'path'
import * as fs from 'fs-extra'
import * as EventEmitter from 'events'

import { merge } from 'lodash'

import { IProjectConfig, PluginItem } from '@tarojs/taro/types/compile'

import {
  IPreset,
  IPlugin,
  IPaths
} from './utils/types'
import {
  CONFIG_DIR_NAME,
  DEFAULT_CONFIG_FILE,
  PluginType
} from './utils/constants'
import { mergePlugins } from './utils'

interface IKernelOptions {
  appPath: string
  presets: PluginItem[]
  plugins: PluginItem[]
}

export default class Kernel extends EventEmitter {
  appPath: string
  presets: IPlugin[]
  plugins: IPlugin[]
  paths: IPaths
  config: IProjectConfig
  configPath: string

  constructor (options: IKernelOptions) {
    super()
    this.init(options)
  }

  init (options: IKernelOptions) {
    this.appPath = options.appPath || process.cwd()
    this.initConfig()
    this.initPresetsAndPlugins(options)
  }

  initConfig () {
    this.configPath = path.join(this.appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE)
    if (!fs.exsits(this.configPath)) {
      // todo log
      process.exit(0)
    }
    this.config = require(this.configPath)(merge)
  }

  initPresetsAndPlugins (options: IKernelOptions) {
    const allConfigPresets = mergePlugins(options.presets, this.config.presets || [])(PluginType.Preset)
    const allConfigPlugins = mergePlugins(options.plugins, this.config.plugins || [])(PluginType.Plugin)

  }

  resolvePresets () {

  }
}
