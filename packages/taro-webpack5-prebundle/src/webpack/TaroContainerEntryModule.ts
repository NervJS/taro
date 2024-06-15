/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ContainerEntryModule.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra, Zackary Jackson @ScriptedAlchemy, Marais Rossouw @maraisr
 */
import webpack, { RuntimeGlobals, sources, Template } from 'webpack'
import ContainerPlugin from 'webpack/lib/container/ContainerPlugin'

const { ConcatSource } = sources

const ContainerEntryModule = require('webpack/lib/container/ContainerEntryModule')

type Exposes = ConstructorParameters<typeof ContainerPlugin>[0]['exposes']
export default class TaroContainerEntryModule extends ContainerEntryModule {
  // eslint-disable-next-line no-useless-constructor
  constructor (name: string, exposes: Exposes, shareScope: string) {
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

webpack.util.serialization.register(TaroContainerEntryModule, '@tarojs/webpack5-runner/dist/prebundle/TaroContainerEntryModule', 'TaroContainerEntryModule', {
  serialize (obj, context) {
    obj.serialize(context)
  },
  deserialize (context) {
    const { read } = context
    const obj = new TaroContainerEntryModule(read(), read(), read())
    obj.deserialize(context)
    return obj
  }
})
