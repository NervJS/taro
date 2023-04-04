import { RuntimeModule } from 'webpack'

import type { ChunkGraph, Compilation } from 'webpack'
import type RemoteModule from 'webpack/lib/container/RemoteModule'

export default class TaroRemoteRuntimeModule extends RuntimeModule {
  compilation: Compilation
  chunkGraph: ChunkGraph

  constructor (private platformType: string) {
    super('remotes loading')
  }

  getDepsMap () {
    const { compilation, chunkGraph } = this
    const { moduleGraph } = compilation
    const chunkToRemotesMapping: Record<string | number, (string | number)[]> = {}
    const idToExternalAndNameMapping = {}
    for (const chunk of compilation.chunks) {
      const modules = ((chunkGraph.getChunkModulesIterableBySourceType(
        chunk,
        'remote'
      )) as unknown) as Iterable<RemoteModule> | undefined
      if (!modules) continue
      const remotes: (string | number)[] = (chunkToRemotesMapping[chunk.id!] = [])
      for (const module of modules) {
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
    return {
      chunkToRemotesMapping,
      idToExternalAndNameMapping
    }
  }

  generate () {
    switch (this.platformType) {
      case 'web':
        return this.generateWeb()
      default:
        return this.generateMini()
    }
  }

  generateWeb () {
    const { compiler, runtimeTemplate } = this.compilation
    const { RuntimeGlobals, Template } = compiler.webpack
    const { chunkToRemotesMapping, idToExternalAndNameMapping } = this.getDepsMap()

    return Template.asString([
      `var chunkMapping = ${JSON.stringify(chunkToRemotesMapping, null, '\t')};`,
      `var idToExternalAndNameMapping = ${JSON.stringify(idToExternalAndNameMapping, null, '\t')};`,
      `${RuntimeGlobals.ensureChunkHandlers}.remotes = ${
        runtimeTemplate.basicFunction('chunkId, promises', [
          `if(${RuntimeGlobals.hasOwnProperty}(chunkMapping, chunkId)) {`,
          Template.indent([
            `chunkMapping[chunkId].forEach(${runtimeTemplate.basicFunction('id', [
              `var getScope = ${RuntimeGlobals.currentRemoteGetScope};`,
              'if(!getScope) getScope = [];',
              'var data = idToExternalAndNameMapping[id];',
              'if(getScope.indexOf(data) >= 0) return;',
              'getScope.push(data);',
              'if(data.p) return promises.push(data.p);',
              `var onError = ${runtimeTemplate.basicFunction('error', [
                'if(!error) error = new Error("Container missing");',
                'if(typeof error.message === "string")',
                Template.indent(
                  'error.message += \'\\nwhile loading "\' + data[1] + \'" from \' + data[2];'
                ),
                `__webpack_modules__[id] = ${runtimeTemplate.basicFunction('', [
                  'throw error;'
                ])}`,
                'data.p = 0;'
              ])};`,
              `var handleFunction = ${runtimeTemplate.basicFunction(
                'fn, arg1, arg2, d, next, first',
                [
                  'try {',
                  Template.indent([
                    'var promise = fn(arg1, arg2);',
                    'if(promise && promise.then) {',
                    Template.indent([
                      `var p = promise.then(${runtimeTemplate.returningFunction(
                        'next(result, d)',
                        'result'
                      )}, onError);`,
                      'if(first) promises.push(data.p = p); else return p;'
                    ]),
                    '} else {',
                    Template.indent(['return next(promise, d, first);']),
                    '}'
                  ]),
                  '} catch(error) {',
                  Template.indent(['onError(error);']),
                  '}'
                ]
              )}`,
              `var onExternal = ${runtimeTemplate.returningFunction(
                `external ? handleFunction(${RuntimeGlobals.initializeSharing}, data[0], 0, external, onInitialized, first) : onError()`,
                'external, _, first'
              )};`,
              `var onInitialized = ${runtimeTemplate.returningFunction(
                'handleFunction(external.get, data[1], getScope, 0, onFactory, first)',
                '_, external, first'
              )};`,
              `var onFactory = ${runtimeTemplate.basicFunction('factory', [
                'data.p = 1;',
                `__webpack_modules__[id] = ${runtimeTemplate.basicFunction(
                  'module',
                  ['module.exports = factory();']
                )}`
              ])};`,
              'handleFunction(__webpack_require__, data[2], 0, 0, onExternal, 1);'
            ])});`
          ]),
          '}'
        ])
      };`
    ])
  }

  generateMini () {
    const { compiler, runtimeTemplate } = this.compilation
    const { RuntimeGlobals, Template } = compiler.webpack
    const { chunkToRemotesMapping, idToExternalAndNameMapping } = this.getDepsMap()

    return Template.asString([
      `var chunkMapping = ${JSON.stringify(chunkToRemotesMapping, null, '\t')};`,
      `var idToExternalAndNameMapping = ${JSON.stringify(idToExternalAndNameMapping, null, '\t')};`,
      `${RuntimeGlobals.require}.taro = ${
        runtimeTemplate.basicFunction('get', [
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
        ])
      };`
    ])
  }
}
