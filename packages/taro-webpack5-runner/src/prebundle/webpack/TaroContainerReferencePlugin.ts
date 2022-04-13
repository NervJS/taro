/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ContainerReferencePlugin.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
 */
import { RuntimeModule, Module, Template, RuntimeGlobals, javascript } from 'webpack'
import { META_TYPE } from '@tarojs/helper'
import { RawSource } from 'webpack-sources'
import { addRequireToSource, getIdOrName } from '../../plugins/TaroLoadChunksPlugin'
import { getChunkEntryModule } from '../../utils/webpack'

import type { Compiler, Compilation, ChunkGraph } from 'webpack'
import type { ConcatSource } from 'webpack-sources'
import type { CollectedDeps } from '../constant'
import type TaroNormalModule from '../../plugins/TaroNormalModule'

const RemoteModule = require('webpack/lib/container/RemoteModule')
const PLUGIN_NAME = 'TaroContainerReferencePlugin'

interface RemoteModule extends Module {
  request: string
  externalRequests: string[]
  internalRequest: string
  shareScope: string
}

interface MFOptions {
  name: string
  remotes: Record<string, string>
}

class TaroRemoteRuntimeModule extends RuntimeModule {
  compilation: Compilation
  chunkGraph: ChunkGraph

  constructor () {
    super('remotes loading')
  }

  generate () {
    const { compilation, chunkGraph } = this
    const { runtimeTemplate, moduleGraph } = compilation
    const chunkToRemotesMapping: Record<string | number, (string | number)[]> = {}
    const idToExternalAndNameMapping = {}
    for (const chunk of compilation.chunks) {
      const modules = ((chunkGraph.getChunkModulesIterableBySourceType(
        chunk,
        'remote'
      )) as unknown) as Iterable<RemoteModule> | undefined
      if (!modules) continue
      const remotes: (string | number)[] = (chunkToRemotesMapping[chunk.id!] = [])
      for (const m of modules) {
        const module: RemoteModule = m
        const name = module.internalRequest
        const id = chunkGraph.getModuleId(module)
        const shareScope = module.shareScope
        const dep = module.dependencies[0]
        const externalModule = moduleGraph.getModule(dep)
        const externalModuleId =
          externalModule && chunkGraph.getModuleId(externalModule)
        remotes.push(id)
        idToExternalAndNameMapping[id] = [shareScope, name, externalModuleId]
      }
    }
    return Template.asString([
      `var chunkMapping = ${JSON.stringify(
        chunkToRemotesMapping,
        null,
        '\t'
      )};`,
      `var idToExternalAndNameMapping = ${JSON.stringify(
        idToExternalAndNameMapping,
        null,
        '\t'
      )};`,
      `${RuntimeGlobals.require}.taro = ${runtimeTemplate.basicFunction('get', [
        'for (var id in idToExternalAndNameMapping) {',
        Template.indent([
          'var mappedName = idToExternalAndNameMapping[id][1];',
          'var factory = get(mappedName);',
          `__webpack_modules__[id] = (${runtimeTemplate.basicFunction(
            'factory',
            [`return ${runtimeTemplate.basicFunction(
              'module',
              ['module.exports = factory();']
            )}`]
          )})(factory);`
        ]),
        '}'
      ])};`
    ])
  }
}

class TaroContainerReferencePlugin {
  private deps: CollectedDeps
  private remoteAssets: { name: string}[]
  private remoteName: string
  private runtimeRequirements: Set<string>

  constructor (options: MFOptions, deps: CollectedDeps, remoteAssets: { name: string}[], runtimeRequirements: Set<string>) {
    this.deps = deps
    this.remoteAssets = remoteAssets
    this.remoteName = Object.keys(options.remotes)[0]
    this.runtimeRequirements = runtimeRequirements
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      PLUGIN_NAME,
      (compilation, { normalModuleFactory }) => {
        /**
         * 把预编译的依赖改为 Remote module 的形式
         * 例如把 import '@tarojs/taro' 改为 import 'lib-app/@tarojs/taro'
         */
        normalModuleFactory.hooks.factorize.tap(
          PLUGIN_NAME,
          data => {
            if (!data.request.includes('!')) {
              for (const dep of this.deps.keys()) {
                if (data.request === dep || data.request === '@tarojs/runtime') {
                  return new RemoteModule(
                    data.request,
                    [`webpack/container/reference/${this.remoteName}`],
                    `./${data.request}`,
                    'default' // share scope
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
            // webpack runtime 增加 Rmote runtime 使用到的工具函数
            this.runtimeRequirements.forEach(item => set.add(item))
            compilation.addRuntimeModule(chunk, new TaroRemoteRuntimeModule())
          }
        )

        /**
         * 在 dist/app.js 头部注入 require，
         * 依赖所有的预编译 chunk 和 remoteEntry
         */
        const hooks = javascript.JavascriptModulesPlugin.getCompilationHooks(compilation)
        hooks.render.tap(
          PLUGIN_NAME,
          (modules: ConcatSource, { chunk }) => {
            const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
            if (chunkEntryModule) {
              const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
              if (entryModule.miniType === META_TYPE.ENTRY) {
                return addRequireToSource(getIdOrName(chunk), modules, this.remoteAssets)
              }
              return modules
            } else {
              return modules
            }
          }
        )

        /**
         * 模块 "webpack/container/reference/lib-app" 用于网络加载 remoteEntry.js，
         * 在小程序环境则不需要了，因此将模块输出改为空字符串，减少不必要的代码
         */
        hooks.renderModuleContent.tap(
          PLUGIN_NAME,
          (source, module: any) => {
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

module.exports = TaroContainerReferencePlugin
