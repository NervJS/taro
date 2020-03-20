import * as path from 'path'
import * as fs from 'fs-extra'
import { EventEmitter } from 'events'

import { merge } from 'lodash'
import { AsyncSeriesWaterfallHook } from 'tapable'
import { IProjectConfig, PluginItem } from '@tarojs/taro/types/compile'

import {
  IPreset,
  IPlugin,
  IPaths,
  IHook,
  ICommand
} from './utils/types'
import {
  CONFIG_DIR_NAME,
  DEFAULT_CONFIG_FILE,
  PluginType,
  DEFAULT_SOURCE_ROOT,
  DEFAULT_OUTPUT_ROOT,
  IS_EVENT_HOOK
} from './utils/constants'
import { mergePlugins, resolvePresetsOrPlugins, convertPluginsToObject } from './utils'
import createBabelRegister from './utils/babelRegister'
import Plugin from './Plugin'

interface IKernelOptions {
  appPath: string
  presets: PluginItem[]
  plugins: PluginItem[]
}

export default class Kernel extends EventEmitter {
  appPath: string
  plugins: IPlugin[]
  paths: IPaths
  config: IProjectConfig
  configPath: string
  extraPlugins: IPlugin[]
  hooks: {
    [name: string]: IHook[]
  }
  methods: {
    [name: string]: Function
  }
  commands: {
    [name: string]: ICommand
  }

  constructor (options: IKernelOptions) {
    super()
    this.init(options)
  }

  async init (options: IKernelOptions) {
    this.appPath = options.appPath || process.cwd()
    this.hooks = {}
    this.methods = {}
    this.commands = {}
    this.initConfig()
    this.initPaths()
    this.initPresetsAndPlugins(options)
    await this.applyPlugins('onReady')
  }

  initConfig () {
    this.configPath = path.join(this.appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE)
    if (!fs.existsSync(this.configPath)) {
      // TD log
      process.exit(0)
    }
    this.config = require(this.configPath)(merge)
  }

  initPaths () {
    this.paths = {} as IPaths
    this.paths.appPath = this.appPath
    this.paths.configPath = this.configPath
    this.paths.sourcePath = path.join(this.appPath, this.config.sourceRoot || DEFAULT_SOURCE_ROOT)
    this.paths.outputPath = path.join(this.appPath, this.config.outputRoot || DEFAULT_OUTPUT_ROOT)
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
    const pluginCtx = this.initPluginCtx({id, path, ctx: this})
    const { presets, plugins } = apply()(pluginCtx, opts) || {}
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
    const pluginCtx = this.initPluginCtx({id, path, ctx: this})
    apply()(pluginCtx, opts)
  }

  registerPlugin (plugin: IPlugin) {
    if (this.plugins[plugin.id]) {
      throw new Error(`插件 ${plugin.id} 已被注册`)
    }
    this.plugins[plugin.id] = plugin
  }

  initPluginCtx ({ id, path, ctx }: { id: string, path: string, ctx: Kernel }) {
    const pluginCtx = new Plugin({ id, path, ctx })
    const internalMethods = ['onReady', 'onStart']
    const kernelApis = ['appPath', 'plugins', 'paths', 'applyPlugins']
    internalMethods.forEach(name => {
      pluginCtx.registerMethod(name)
    })
    kernelApis.forEach(name => {
      pluginCtx[name] = typeof this[name] === 'function' ? this[name].bind(this) : this[name]
    })
    Object.keys(this.methods).forEach(name => {
      if (typeof this.methods[name] === 'function') {
        pluginCtx[name] = this.methods[name]
      }
    })
    return pluginCtx
  }

  async applyPlugins (args: string | { name: string, initialVal?: any, opts?: any }) {
    let name
    let initialVal
    let opts
    if (typeof args === 'string') {
      name = args
    } else {
      name = opts.name
      initialVal = args.initialVal
      opts = args.opts
    }
    if (typeof name !== 'string') {
      throw new Error(`调用失败，未传入正确的名称！`)
    }
    const hooks = this.hooks[name] || []
    const waterfall = new AsyncSeriesWaterfallHook(['arg'])
    if (hooks.length) {
      if (IS_EVENT_HOOK.test(name)) {
        for (const hook of hooks) {
          waterfall.tapPromise({
            name,
            stage: hook.stage || 0,
            before: hook.before
          }, async () => {
            await hook.fn(opts)
          })
        }
      } else {
        for (const hook of hooks) {
          waterfall.tapPromise({
            name,
            stage: hook.stage || 0,
            before: hook.before
          }, async (arg) => {
            return await hook.fn(arg, opts)
          })
        }
      }
    }
    await waterfall.promise(initialVal)
  }

  async run (args: string | { name: string, opts?: any }) {
    let name
    let opts
    if (typeof args === 'string') {
      name = args
    } else {
      name = opts.name
      opts = args.opts
    }
    await this.applyPlugins('onStart')
    if (!this.commands[name]) {
      throw new Error(`${name} 命令不存在`)
    }
    await this.applyPlugins({
      name,
      opts
    })
  }
}
