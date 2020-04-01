import * as path from 'path'
import { EventEmitter } from 'events'

import { AsyncSeriesWaterfallHook } from 'tapable'
import { IProjectConfig, PluginItem } from '@tarojs/taro/types/compile'
import {
  NODE_MODULES,
  recursiveFindNodeModules,
  createBabelRegister
} from '@tarojs/helper'
import * as helper from '@tarojs/helper'

import {
  IPreset,
  IPlugin,
  IPaths,
  IHook,
  ICommand,
  IPlatform
} from './utils/types'
import {
  PluginType,
  IS_MODIFY_HOOK,
  IS_ADD_HOOK,
  IS_EVENT_HOOK
} from './utils/constants'
import { mergePlugins, resolvePresetsOrPlugins, convertPluginsToObject } from './utils'
import Plugin from './Plugin'
import Config from './Config'

interface IKernelOptions {
  appPath: string
  presets: PluginItem[]
  plugins: PluginItem[]
}

export default class Kernel extends EventEmitter {
  appPath: string
  isWatch: boolean
  isProduction: boolean
  optsPresets: PluginItem[]
  optsPlugins: PluginItem[]
  plugins: Map<string, IPlugin>
  paths: IPaths
  extraPlugins: IPlugin[]
  config: Config
  initialConfig: IProjectConfig
  hooks: Map<string, IHook[]>
  methods: Map<string, Function>
  commands: Map<string, ICommand>
  platforms: Map<string, IPlatform>
  helper: any
  runOpts: any

  constructor (options: IKernelOptions) {
    super()
    this.appPath = options.appPath || process.cwd()
    this.optsPresets = options.presets
    this.optsPlugins = options.plugins
    this.hooks = new Map()
    this.methods = new Map()
    this.commands = new Map()
    this.platforms = new Map()
    this.initHelper()
  }

  async init () {
    this.initConfig()
    this.initPaths()
    this.initPresetsAndPlugins()
    await this.applyPlugins('onReady')
  }

  initConfig () {
    this.config = new Config({
      appPath: this.appPath
    })
    this.initialConfig = this.config.initialConfig
  }

  initPaths () {
    this.paths = {
      appPath: this.appPath,
      nodeModulesPath: recursiveFindNodeModules(path.join(this.appPath, NODE_MODULES))
    } as IPaths
    if (this.config.isInitSuccess) {
      Object.assign(this.paths, {
        configPath: this.config.configPath,
        sourcePath: path.join(this.appPath, this.initialConfig.sourceRoot as string),
        outputPath: path.join(this.appPath, this.initialConfig.outputRoot as string)
      })
    }
  }

  initHelper () {
    this.helper = helper
  }

  initPresetsAndPlugins () {
    const initialConfig = this.initialConfig
    const allConfigPresets = mergePlugins(this.optsPresets || [], initialConfig.presets || [])(PluginType.Preset)
    const allConfigPlugins = mergePlugins(this.optsPlugins || [], initialConfig.plugins || [])(PluginType.Plugin)
    createBabelRegister({
      only: [...Object.keys(allConfigPresets), ...Object.keys(allConfigPlugins)]
    })
    this.plugins = new Map()
    this.extraPlugins = []
    this.resolvePresets(allConfigPresets)
    this.resolvePlugins(allConfigPlugins)
  }

  resolvePresets (presets) {
    const allPresets = resolvePresetsOrPlugins(this.appPath, presets, PluginType.Preset)
    while (allPresets.length) {
      this.initPreset(allPresets.shift()!)
    }
  }

  resolvePlugins (plugins) {
    const allPlugins = resolvePresetsOrPlugins(this.appPath, plugins, PluginType.Plugin)
    const _plugins = [...this.extraPlugins, ...allPlugins]
    while (_plugins.length) {
      this.initPlugin(_plugins.shift()!)
    }
    this.extraPlugins = []
  }

  initPreset (preset: IPreset) {
    const { id, path, opts, apply } = preset
    const pluginCtx = this.initPluginCtx({ id, path, ctx: this })
    const { presets, plugins } = apply()(pluginCtx, opts) || {}
    this.registerPlugin(preset)
    if (Array.isArray(presets)) {
      const _presets = resolvePresetsOrPlugins(this.appPath, convertPluginsToObject(presets)(PluginType.Preset), PluginType.Preset)
      while (_presets.length) {
        this.initPreset(_presets.shift()!)
      }
    }
    if (Array.isArray(plugins)) {
      this.extraPlugins.push(...resolvePresetsOrPlugins(this.appPath,convertPluginsToObject(plugins)(PluginType.Plugin), PluginType.Plugin))
    }
  }

  initPlugin (plugin: IPlugin) {
    const { id, path, opts, apply } = plugin
    const pluginCtx = this.initPluginCtx({ id, path, ctx: this })
    this.registerPlugin(plugin)
    apply()(pluginCtx, opts)
  }

  registerPlugin (plugin: IPlugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`插件 ${plugin.id} 已被注册`)
    }
    this.plugins.set(plugin.id, plugin)
  }

  initPluginCtx ({ id, path, ctx }: { id: string, path: string, ctx: Kernel }) {
    const pluginCtx = new Plugin({ id, path, ctx })
    const internalMethods = ['onReady', 'onStart']
    const kernelApis = [
      'appPath',
      'plugins',
      'paths',
      'helper',
      'runOpts',
      'initialConfig',
      'applyPlugins'
    ]
    internalMethods.forEach(name => {
      if (!this.methods.has(name)) {
        pluginCtx.registerMethod(name)
      }
    })
    return new Proxy(pluginCtx, {
      get: (target, name: string) => {
        if (this.methods.has(name)) return this.methods.get(name)
        if (kernelApis.includes(name)) {
          return typeof this[name] === 'function' ? this[name].bind(this) : this[name]
        }
        return target[name]
      }
    })
  }

  async applyPlugins (args: string | { name: string, initialVal?: any, opts?: any }) {
    let name
    let initialVal
    let opts
    if (typeof args === 'string') {
      name = args
    } else {
      name = args.name
      initialVal = args.initialVal
      opts = args.opts
    }
    if (typeof name !== 'string') {
      throw new Error(`调用失败，未传入正确的名称！`)
    }
    const hooks = this.hooks.get(name) || []
    const waterfall = new AsyncSeriesWaterfallHook(['arg'])
    if (hooks.length) {
      const resArr: any[] = []
      for (const hook of hooks) {
        waterfall.tapPromise({
          name: hook.plugin,
          stage: hook.stage || 0,
          before: hook.before
        }, async arg => {
          const res = await hook.fn(opts, arg)
          if (IS_MODIFY_HOOK.test(name) && IS_EVENT_HOOK.test(name)) {
            return res
          }
          if (IS_ADD_HOOK.test(name)) {
            resArr.push(res)
            return resArr
          }
          return null
        })
      }
    }
    return await waterfall.promise(initialVal)
  }

  runWithPlatform (platform) {
    if (!this.platforms.has(platform)) {
      throw `不存在编译平台 ${platform}`
    }
    const withNameConfig = this.config.getConfigWithNamed(platform, this.platforms.get(platform)!.useConfigName)
    return withNameConfig
  }

  setRunOpts (opts) {
    this.runOpts = opts
  }

  async run (args: string | { name: string, opts?: any }) {
    let name
    let opts
    if (typeof args === 'string') {
      name = args
    } else {
      name = args.name
      opts = args.opts
    }
    this.setRunOpts(opts)
    await this.init()
    await this.applyPlugins('onStart')
    if (!this.commands.has(name)) {
      throw new Error(`${name} 命令不存在`)
    }
    if (opts.platform) {
      opts.config = this.runWithPlatform(opts.platform)
    }
    await this.applyPlugins({
      name,
      opts
    })
  }
}
