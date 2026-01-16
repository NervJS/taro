/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ContainerPlugin.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra, Zackary Jackson @ScriptedAlchemy, Marais Rossouw @maraisr
 */
import ContainerPlugin from 'webpack/lib/container/ContainerPlugin'

import TaroContainerEntryModuleFactory from './TaroContainerEntryModuleFactory'

import type { PLATFORM_TYPE } from '@tarojs/shared'
import type { Compiler } from 'webpack'

const ContainerEntryDependency = require('webpack/lib/container/ContainerEntryDependency')

const PLUGIN_NAME = 'TaroContainerPlugin'

interface IParams {
  env: string
  platformType: PLATFORM_TYPE
  runtimeRequirements?: Set<string>
}

class TaroContainerPlugin extends ContainerPlugin {
  runtimeRequirements: Exclude<IParams['runtimeRequirements'], undefined>

  constructor (options, private params: IParams) {
    super(options)
    this.runtimeRequirements = params.runtimeRequirements || new Set()
  }

  apply (compiler: Compiler) {
    switch (this.params.platformType) {
      case 'web':
        super.apply(compiler)
        break
      default:
        super.apply(compiler)
        this.applyMiniApp(compiler)
    }
    compiler.hooks.thisCompilation.tap(
      {
        name: PLUGIN_NAME,
        stage: 100
      },
      compilation => {
        /**
         * 收集打包 Remote 应用时使用到的 Webpack runtime 工具函数。
         * Remote 应用与 Host 应用的 runtime 可以共用减少重复代码加载，
         * 可以为 Host 应用的 Webpack runtime 增加 Remote 应用使用到的工具函数。
         */
        compilation.hooks.afterRuntimeRequirements.tap(
          PLUGIN_NAME,
          () => {
            const chunkGraphEntries = (compilation as any)._getChunkGraphEntries()
            for (const chunk of chunkGraphEntries) {
              if (chunk.name === 'runtime') {
                const chunkGraph = compilation.chunkGraph
                const cgc = (chunkGraph as any)._getChunkGraphChunk(chunk)
                const runtimeRequirements = cgc.runtimeRequirementsInTree
                runtimeRequirements.forEach(item => this.runtimeRequirements.add(item))
              }
            }
          }
        )

        /**
         * 删除多余的 assets
         *  - entry chunk
         *  - remote runtime chunk
         */
        compilation.hooks.processAssets.tapAsync(
          PLUGIN_NAME,
          async (assets, callback: any) => {
            delete assets['main.js']
            delete assets['runtime.js']
            callback()
          }
        )
      })
  }

  applyMiniApp (compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(
      {
        name: PLUGIN_NAME,
        stage: 100
      },
      compilation => {
        /**
         * 劫持 ContainerEntryDependency，把生成的 Module 替换为 TaroContainerEntryModule
         * 目的是修改 remoteEntry.js 的 container module 输出：
         *   1. 插入 taroModuleMap 把异步逻辑改为同步
         *   2. 插入自动注册模块的逻辑
         */
        compilation.dependencyFactories.set(
          ContainerEntryDependency,
          new TaroContainerEntryModuleFactory()
        )
      }
    )
  }
}

export default TaroContainerPlugin
