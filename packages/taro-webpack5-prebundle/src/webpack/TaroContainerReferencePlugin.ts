/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ContainerReferencePlugin.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
 */
import { META_TYPE } from '@tarojs/helper'
import { RuntimeGlobals, sources } from 'webpack'
import ContainerReferencePlugin from 'webpack/lib/container/ContainerReferencePlugin'
import RemoteModule from 'webpack/lib/container/RemoteModule'

import { addRequireToSource, getChunkEntryModule, getChunkIdOrName } from '../utils'
import { CollectedDeps, MF_NAME } from '../utils/constant'
import TaroRemoteRuntimeModule from './TaroRemoteRuntimeModule'

import type { Compiler, NormalModule } from 'webpack'
import type { ContainerReferencePluginOptions, RemotesConfig } from 'webpack/types'

const ExternalsPlugin = require('webpack/lib/ExternalsPlugin')
const FallbackDependency = require('webpack/lib/container/FallbackDependency')
const FallbackItemDependency = require('webpack/lib/container/FallbackItemDependency')
const FallbackModuleFactory = require('webpack/lib/container/FallbackModuleFactory')
const RemoteToExternalDependency = require('webpack/lib/container/RemoteToExternalDependency')

const PLUGIN_NAME = 'TaroContainerReferencePlugin'
const slashCode = '/'.charCodeAt(0)

const { RawSource } = sources

type MFOptions = Partial<ContainerReferencePluginOptions>

interface IParams {
  deps: CollectedDeps
  env: string
  remoteAssets?: Record<'name', string>[]
  runtimeRequirements: Set<string>
}

export default class TaroContainerReferencePlugin extends ContainerReferencePlugin {
  private deps: IParams['deps']
  private remoteAssets: Exclude<IParams['remoteAssets'], undefined>
  private remoteName: string
  private remoteConfig: RemotesConfig
  private runtimeRequirements: IParams['runtimeRequirements']

  protected _remoteType?: ContainerReferencePluginOptions['remoteType']
  protected _remotes

  constructor (options: MFOptions, private params: IParams) {
    super(options as ContainerReferencePluginOptions)
    const { remotes = {} } = options
    const remoteName = Object.keys(remotes)[0] || MF_NAME
    const [, remoteConfig] = this._remotes.find(([key, config]) => key === remoteName && config) || [this.remoteName, { external: [], shareScope: 'default' }]
    this.deps = params.deps
    this.remoteAssets = params.remoteAssets || []
    this.remoteName = remoteName
    this.remoteConfig = remoteConfig
    this.runtimeRequirements = params.runtimeRequirements
  }

  apply (compiler: Compiler) {
    switch (this.params.env) {
      case 'h5':
        this.applyWebApp(compiler)
        break
      default:
        this.applyMiniApp(compiler)
    }
  }

  applyWebApp (compiler: Compiler) {
    const { _remotes: remotes, _remoteType: remoteType } = this
    const remoteExternals: Record<string, string> = {}
    for (const [key, config] of remotes) {
      let i = 0
      for (const external of config.external) {
        if (external.startsWith('internal ')) continue
        remoteExternals[
          `webpack/container/reference/${key}${i ? `/fallback-${i}` : ''}`
        ] = external
        i++
      }
    }

    new ExternalsPlugin(remoteType, remoteExternals).apply(compiler)

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      compilation.dependencyFactories.set(RemoteToExternalDependency, normalModuleFactory)
      compilation.dependencyFactories.set(FallbackItemDependency, normalModuleFactory)
      compilation.dependencyFactories.set(FallbackDependency, new FallbackModuleFactory())

      /**
       * 把预编译的依赖改为 Remote module 的形式
       * 例如把 import '@tarojs/taro' 改为 import '[remote]/@tarojs/taro'
       */
      normalModuleFactory.hooks.factorize.tap(PLUGIN_NAME, data => {
        if (!data.request.includes('!')) {
          for (const [key, config] of remotes) {
            if (
              data.request.startsWith(`${key}`) && (data.request.length === key.length || data.request.charCodeAt(key.length) === slashCode)
            ) {
              return new RemoteModule(
                data.request,
                config.external.map((external, i) =>
                  external.startsWith('internal ') ? external.slice(9) : `webpack/container/reference/${key}${i ? `/fallback-${i}` : ''}`
                ),
                `.${data.request.slice(key.length)}`,
                config.shareScope
              )
            }
          }
          const [key, config] = [this.remoteName, this.remoteConfig]
          for (const dep of this.deps.keys()) {
            if (data.request === dep || data.request === '@tarojs/runtime') {
              const externalList = typeof config.external === 'string' ? [config.external] : config.external
              return new RemoteModule(
                `${key}/${data.request}`,
                externalList.map((external, i) =>
                  external.startsWith('internal ')
                    ? external.slice(9)
                    : `webpack/container/reference/${key}${i ? `/fallback-${i}` : ''}`
                ),
                `./${data.request}`,
                config.shareScope || 'default' // share scope
              )
            }
          }
        }
      })

      compilation.hooks.runtimeRequirementInTree
        .for(RuntimeGlobals.ensureChunkHandlers)
        .tap(PLUGIN_NAME, (chunk, set) => {
          set.add(RuntimeGlobals.module)
          set.add(RuntimeGlobals.moduleFactoriesAddOnly)
          set.add(RuntimeGlobals.hasOwnProperty)
          set.add(RuntimeGlobals.initializeSharing)
          set.add(RuntimeGlobals.shareScopeMap)
          compilation.addRuntimeModule(chunk, new TaroRemoteRuntimeModule(this.params.env))
        })
    })
  }

  applyMiniApp (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      PLUGIN_NAME,
      (compilation, { normalModuleFactory }) => {
        /**
         * 把预编译的依赖改为 Remote module 的形式
         * 例如把 import '@tarojs/taro' 改为 import '[remote]/@tarojs/taro'
         */
        const [key, config] = this._remotes.find(([key, config]) => key === this.remoteName && config) || { external: [], shareScope: 'default' }
        normalModuleFactory.hooks.factorize.tap(
          PLUGIN_NAME,
          data => {
            if (!data.request.includes('!')) {
              for (const dep of this.deps.keys()) {
                if (data.request === dep || data.request === '@tarojs/runtime') {
                  return new RemoteModule(
                    data.request,
                    config.external.map((external, i) =>
                      external.startsWith('internal ')
                        ? external.slice(9)
                        : `webpack/container/reference/${key}${i ? `/fallback-${i}` : ''}`
                    ),
                    `./${data.request}`,
                    config.shareScope // share scope
                  )
                }
              }
            }
          }
        )

        /**
         * 修改 webpack runtime
         *   1. 注入一些 webpack 内置的工具函数（remote 打包时注入了，而 host 里没有，需要补全，后续改为自动补全）
         *   2. 修改 webpack/runtime/remotes 模块的输出
         *     a) 生成 id 映射对象 idToExternalAndNameMapping
         *     b) 插入自动注册模块的逻辑
         */
        compilation.hooks.additionalTreeRuntimeRequirements.tap(
          PLUGIN_NAME,
          (chunk, set) => {
            // webpack runtime 增加 Remote runtime 使用到的工具函数
            this.runtimeRequirements.forEach(item => set.add(item))
            compilation.addRuntimeModule(chunk, new TaroRemoteRuntimeModule(this.params.env))
          }
        )

        /**
         * 在 dist/app.js 头部注入 require，
         * 依赖所有的预编译 chunk 和 remoteEntry
         */
        const hooks = compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation)
        hooks.render.tap(
          PLUGIN_NAME,
          (modules: sources.ConcatSource, { chunk }) => {
            const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
            if (chunkEntryModule) {
              const entryModule = chunkEntryModule.rootModule ?? chunkEntryModule
              if (entryModule.miniType === META_TYPE.ENTRY) {
                return addRequireToSource(getChunkIdOrName(chunk), modules, this.remoteAssets)
              }
              return modules
            } else {
              return modules
            }
          }
        )

        /**
         * 模块 "webpack/container/reference/[remote]" 用于网络加载 remoteEntry.js，
         * 在小程序环境则不需要了，因此将模块输出改为空字符串，减少不必要的代码
         */
        hooks.renderModuleContent.tap(
          PLUGIN_NAME,
          (source, module: NormalModule) => {
            if (module.userRequest === `webpack/container/reference/${this.remoteName}`) {
              return new RawSource('')
            }
            return source
          }
        )
      }
    )
  }
}
