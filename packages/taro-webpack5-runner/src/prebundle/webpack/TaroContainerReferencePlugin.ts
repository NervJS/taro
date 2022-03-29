/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ContainerReferencePlugin.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
 */
import * as path from 'path'
import { RuntimeModule, Module, Template, RuntimeGlobals, javascript } from 'webpack'
import { META_TYPE } from '@tarojs/helper'
import { addRequireToSource, getIdOrName } from '../../plugins/TaroLoadChunksPlugin'
import { getChunkEntryModule } from '../../utils/webpack'

import type { Compiler, Compilation, ChunkGraph, StatsCompilation } from 'webpack'
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
  private options: MFOptions
  private deps: CollectedDeps
  private stats: StatsCompilation

  constructor (options, deps: CollectedDeps, stats: StatsCompilation) {
    this.options = options
    this.deps = deps
    this.stats = stats
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      PLUGIN_NAME,
      (compilation, { normalModuleFactory }) => {
        normalModuleFactory.hooks.factorize.tap(
          PLUGIN_NAME,
          data => {
            if (!data.request.includes('!')) {
              for (const dep of this.deps.keys()) {
                // data.request.includes('taro') && !data.request.includes('node_modules') && console.log('data.request: ', data.request)
                if (data.request === dep || data.request === '@tarojs/runtime') {
                  return new RemoteModule(
                    data.request,
                    [`webpack/container/reference/${Object.keys(this.options.remotes)[0]}`],
                    `./${data.request}`,
                    'default' // share scope
                  )
                }
              }
            }
          }
        )

        compilation.hooks.additionalTreeRuntimeRequirements.tap(
          PLUGIN_NAME,
          (chunk, set) => {
            set.add(RuntimeGlobals.makeNamespaceObject)
            compilation.addRuntimeModule(chunk, new TaroRemoteRuntimeModule())
          }
        )

        javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(
          PLUGIN_NAME,
          (modules: ConcatSource, { chunk }) => {
            const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
            if (chunkEntryModule) {
              const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
              if (entryModule.miniType === META_TYPE.ENTRY) {
                const assets = this.stats.assets
                  ?.filter(item => item.name !== 'runtime.js')
                  ?.map(item => ({
                    name: path.join('prebundle', item.name)
                  })) || []
                return addRequireToSource(getIdOrName(chunk), modules, assets)
              }
              return modules
            } else {
              return modules
            }
          })
      }
    )
  }
}

module.exports = TaroContainerReferencePlugin
