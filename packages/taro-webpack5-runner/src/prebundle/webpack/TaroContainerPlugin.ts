/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ContainerPlugin.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra, Zackary Jackson @ScriptedAlchemy, Marais Rossouw @maraisr
 */
const ContainerEntryDependency = require('webpack/lib/container/ContainerEntryDependency')
const ContainerEntryModuleFactory = require('webpack/lib/container/ContainerEntryModuleFactory')
const ContainerEntryModule = require('webpack/lib/container/ContainerEntryModule')
const RuntimeGlobals = require('webpack/lib/RuntimeGlobals')
const Template = require('webpack/lib/Template')
const { ConcatSource } = require('webpack-sources')

const PLUGIN_NAME = 'TaroContainerPlugin'

class TaroContainerEntryModuleFactory extends ContainerEntryModuleFactory {
  create ({ dependencies: [dependency] }, callback) {
    const dep = dependency
    callback(null, {
      module: new TaroContainerEntryModule(dep.name, dep.exposes, dep.shareScope)
    })
  }
}

class TaroContainerEntryModule extends ContainerEntryModule {
  // eslint-disable-next-line no-useless-constructor
  constructor (name, exposes, shareScope) {
    super(name, exposes, shareScope)
  }

  codeGeneration ({ moduleGraph, chunkGraph, runtimeTemplate }) {
    const result = super.codeGeneration({ moduleGraph, chunkGraph, runtimeTemplate })
    const originSource = result.sources.get('javascript')
    const newSources = new ConcatSource(originSource)

    const runtimeRequirements = new Set([
      RuntimeGlobals.definePropertyGetters,
      RuntimeGlobals.hasOwnProperty,
      RuntimeGlobals.exports
    ])
    const getters: string[] = []

    for (const block of this.blocks) {
      const { dependencies } = block

      const modules = dependencies.map(dependency => {
        const dep = dependency
        return {
          name: dep.exposedName,
          module: moduleGraph.getModule(dep),
          request: dep.userRequest
        }
      })

      const str = `return ${runtimeTemplate.returningFunction(
        `(${modules
          .map(({ module, request }) =>
            runtimeTemplate.moduleRaw({
              module,
              chunkGraph,
              request,
              weak: false,
              runtimeRequirements
            })
          )
          .join(', ')})`
      )
      };`

      getters.push(
        `${JSON.stringify(modules[0].name)}: ${runtimeTemplate.basicFunction(
          '',
          str
        )}`
      )
    }

    const res = Template.asString([
      '\n',
      'var taroModuleMap = {',
      Template.indent(getters.join(',\n')),
      '};',
      `var taroGet = ${runtimeTemplate.basicFunction('module', [
        'return taroModuleMap[module]();'
      ])};`,
      '__webpack_require__.taro(taroGet);'
    ])

    newSources.add(res)

    result.sources.set('javascript', newSources)
    return result
  }
}

/**
 * 劫持 ContainerEntryDependency，把生成的 Module 替换为 TaroContainerEntryModule
 * 目的是修改 remoteEntry.js 的 container module 输出：
 *   1. 插入 taroModuleMap 把异步逻辑改为同步
 *   2. 插入自动注册模块的逻辑
 */
class TaroContainerPlugin {
  runtimeRequirements: Set<string>

  constructor (runtimeRequirements) {
    this.runtimeRequirements = runtimeRequirements
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap(
      {
        name: PLUGIN_NAME,
        stage: 100
      },
      compilation => {
        compilation.dependencyFactories.set(
          ContainerEntryDependency,
          new TaroContainerEntryModuleFactory()
        )

        /**
         * 收集打包 Remote 应用时使用到的 Webpack runtime 工具函数。
         * 因为小程序中 Remote 应用也使用 Host 应用的 runtime，所以
         * Host 应用的 Webpack runtime 需要增加上 Remote 应用使用到的工具函数。
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
      }
    )
  }
}

export default TaroContainerPlugin
