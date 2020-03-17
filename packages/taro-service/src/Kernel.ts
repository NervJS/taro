import * as path from 'path'
import * as fs from 'fs-extra'
import { EventEmitter } from 'events'

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
import { mergePlugins, resolvePresetsOrPlugins, convertPluginsToObject } from './utils'
import createBabelRegister from './utils/babelRegister'

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
  extraPlugins: IPlugin[]

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
    if (!fs.existsSync(this.configPath)) {
      // TD log
      process.exit(0)
    }
    this.config = require(this.configPath)(merge)
  }

  initPresetsAndPlugins (options: IKernelOptions) {
    const allConfigPresets = mergePlugins(options.presets || [], this.config.presets || [])(PluginType.Preset)
    const allConfigPlugins = mergePlugins(options.plugins || [], this.config.plugins || [])(PluginType.Plugin)
    createBabelRegister({
      only: [...Object.keys(allConfigPresets), ...Object.keys(allConfigPlugins)],
      babelConfig: this.config.babel
    })
    this.plugins = []
    this.extraPlugins = []
    this.resolvePresets(allConfigPresets)
    this.resolvePlugins(allConfigPlugins)
  }

  resolvePresets (presets) {
    const allPresets = resolvePresetsOrPlugins(presets, PluginType.Preset)
    while (allPresets.length) {
      this.initPreset(allPresets.shift()!)
    }
  }

  resolvePlugins (plugins) {
    const allPlugins = resolvePresetsOrPlugins(plugins, PluginType.Plugin)
    const _plugins = [...this.extraPlugins, ...allPlugins]
    while (_plugins.length) {
      this.initPlugin(_plugins.shift()!)
    }
    this.extraPlugins = []
  }

  initPreset (preset: IPreset) {
    const { id, path, opts, apply } = preset
    const { presets, plugins } = apply()(this, opts) || {}
    this.registerPlugin(preset)
    if (Array.isArray(presets)) {
      const _presets = resolvePresetsOrPlugins(convertPluginsToObject(presets)(PluginType.Preset), PluginType.Preset)
      while (_presets.length) {
        this.initPreset(_presets.shift()!)
      }
    }
    if (Array.isArray(plugins)) {
      this.extraPlugins.push(...resolvePresetsOrPlugins(convertPluginsToObject(plugins)(PluginType.Plugin), PluginType.Plugin))
    }
  }

  initPlugin (plugin: IPlugin) {
    const { id, path, opts, apply } = plugin
    this.registerPlugin(plugin)
    apply()(this, opts)
  }

  registerPlugin (plugin: IPlugin) {
    if (this.plugins[plugin.id]) {
      throw new Error('插件已被注册')
    }
    this.plugins[plugin.id] = plugin
  }
}
