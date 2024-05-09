/**
 * inspire from mini-css-extract-plugin
 *
 * # mini-css-extract-plugin
 * ## License
  Copyright JS Foundation and other contributors

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  'Software'), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import path from 'path'
import webpack, { type Compiler, Dependency, Module, } from 'webpack'

import type { MiniCombination } from '../webpack/MiniCombination'

const PLUGIN_NAME = 'taro-compile-mode-plugin'
const MODULE_TYPE = 'xml/compile-mode'
const TYPES = new Set([MODULE_TYPE])
const CODE_GENERATION_RESULT = {
  sources: new Map(),
  runtimeRequirements: new Set<string>(),
}

export const FILE_COUNTER_MAP = new Map<string, number>()
export const templatesCache: string[] = []

class XMLDependencyTemplate {
  apply () {}
}

export class XMLDependency extends Dependency {
  public identifier: string
  public context: string
  public content: string
  public resourcePath: string
  public fileCount: number

  constructor ({ identifier, context, content, resourcePath, fileCount }) {
    super()
    this.identifier = identifier
    this.context = context
    this.content = content
    this.resourcePath = resourcePath
    this.fileCount = fileCount
  }

  getResourceIdentifier () {
    return `xml-module-${this.identifier}`
  }

  getModuleEvaluationSideEffectsState () {
    return webpack.ModuleGraphConnection.TRANSITIVE_ONLY as any
  }

  serialize (context) {
    const { write } = context
    write(this.identifier)
    write(this.context)
    write(this.content)
    write(this.resourcePath)
    write(this.fileCount)
    super.serialize(context)
  }

  deserialize (context) {
    super.deserialize(context)
  }
}

webpack.util.serialization.register(XMLDependency, '@tarojs/webpack5-runner/dist/plugins/MiniCompileModePlugin/XMLDependency', 'XMLDependency', {
  serialize (obj, context) {
    obj.serialize(context)
  },
  deserialize (context) {
    const { read } = context
    const _identifier = read()
    const _context = read()
    const content = read()
    const resourcePath = read()
    const fileCount = read()
    FILE_COUNTER_MAP.set(resourcePath, fileCount)
    const obj = new XMLDependency({
      identifier: _identifier,
      context: _context,
      content: content,
      resourcePath: resourcePath,
      fileCount: fileCount,
    })
    obj.deserialize(context)
    return obj
  }
})

class XMLModule extends Module {
  public _identifier: string
  public _context: string
  public content: string

  private _needBuild = true

  constructor ({ identifier, context, content }) {
    super(MODULE_TYPE, context)
    this._identifier = identifier
    this._context = context
    this.content = content
  }

  identifier () {
    return `${this.type}|${this._identifier}`
  }

  readableIdentifier () {
    return this._identifier
  }

  getSourceTypes () {
    return TYPES
  }

  codeGeneration () {
    return CODE_GENERATION_RESULT
  }

  size () {
    return this.content.length
  }

  build (_options, compilation, _resolver, _fileSystem, callback) {
    this.buildInfo = {
      cacheable: true,
      hash: this._computeHash(compilation.outputOptions.hashFunction)
    }
    this.buildMeta = {}
    this._needBuild = false
    callback()
  }

  needBuild (_context, callback) {
    callback(null, this._needBuild)
  }

  updateHash (hash, context) {
    super.updateHash(hash, context)
    hash.update(this.buildInfo.hash)
  }

  updateCacheModule (module) {
    if (this.content !== module.content) {
      super.updateCacheModule(module)
      this._needBuild = true
      this.content = module.content
    }
  }

  _computeHash (hashFunction) {
    const hash = webpack.util.createHash(hashFunction)
    hash.update(this.content)
    return hash.digest('hex')
  }

  serialize (context) {
    const { write } = context
    write(this._identifier)
    write(this._context)
    write(this.content)
    write(this._needBuild)
    super.serialize(context)
  }

  deserialize (context) {
    this._needBuild = context.read()

    super.deserialize(context)
  }
}

webpack.util.serialization.register(XMLModule, '@tarojs/webpack5-runner/dist/plugins/MiniCompileModePlugin/XMLModule', 'XMLModule', {
  serialize (obj, context) {
    obj.serialize(context)
  },
  deserialize (context) {
    const { read } = context
    const _identifier = read()
    const _context = read()
    const content = read()
    const obj = new XMLModule({
      identifier: _identifier,
      context: _context,
      content: content,
    })
    obj.deserialize(context)
    return obj
  }
})

class XMLFactory {
  create ({ dependencies }, callback) {
    callback(undefined, new XMLModule(dependencies[0]))
  }
}

interface IPluginOptions {
  combination: MiniCombination
}

export default class MiniCompileModePlugin {
  // eslint-disable-next-line no-useless-constructor
  constructor (private options: IPluginOptions) {}

  apply (compiler: Compiler) {
    const combination = this.options.combination
    const fileType = combination.fileType
    const template = combination.config.template

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
      compilation.dependencyFactories.set(XMLDependency, new XMLFactory())
      compilation.dependencyTemplates.set(XMLDependency, new XMLDependencyTemplate())
      compilation.hooks.renderManifest.tap(PLUGIN_NAME, (result, { chunk }) => {
        const renderedModules = Array.from(compilation.chunkGraph.getChunkModulesIterableBySourceType(chunk, MODULE_TYPE) || []) as XMLModule[]
        if (renderedModules.length > 0) {
          result.push({
            render: () => {
              const { ConcatSource } = webpack.sources
              const source = new ConcatSource()
              this.sortModules(renderedModules)
              for (const module of renderedModules) {
                source.add(module.content)
                source.add('\n')
              }
              return source
            },
            filenameTemplate: `[name]-templates${fileType.templ}`,
            pathOptions: {
              chunk,
              contentHashType: MODULE_TYPE
            },
            identifier: `${PLUGIN_NAME}.${chunk.id}`,
            hash: chunk.contentHash[MODULE_TYPE]
          })
        }
        return result
      })
      compilation.hooks.contentHash.tap(PLUGIN_NAME, (chunk) => {
        const { outputOptions, chunkGraph } = compilation
        const modules = Array.from(chunkGraph.getChunkModulesIterableBySourceType(chunk, MODULE_TYPE) || []) as XMLModule[]

        if (modules.length) {
          const { hashFunction, hashDigest, hashDigestLength } = outputOptions
          const hash = webpack.util.createHash(hashFunction!)
          this.sortModules(modules)
          for (const m of modules) {
            hash.update(chunkGraph.getModuleHash(m, chunk.runtime))
          }

          chunk.contentHash[MODULE_TYPE] = (hash.digest(hashDigest) as string).substring(0, hashDigestLength)
        }
      })
      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT
        },
        async (assets, callback) => {
          const baseTemplName = `base${fileType.templ}`
          const raw = assets[baseTemplName]
          const { ConcatSource } = compiler.webpack.sources
          const source = new ConcatSource(raw)

          if (templatesCache.length) {
            let cur
            while ((cur = templatesCache.shift()) !== undefined) {
              source.add('\n')
              source.add(cur)
            }
          } else {
            Object.keys(assets)
              .filter(key => (new RegExp(`-templates${fileType.templ}$`)).test(key))
              .map(key => {
                const source = new ConcatSource()
                source.add(`<import src="${path.relative(path.dirname(key), `./${baseTemplName}`)}"/>\n`)
                if (fileType.xs) {
                  const content = template.buildXsTemplate(path.relative(path.dirname(key), `./utils`)) + '\n'
                  source.add(content)
                }
                source.add(assets[key])
                assets[key] = source
                return key
              })
              .reduce((pre, cur) => {
                pre.add(`\n<import src="${cur}"/>`)
                return pre
              }, source)
          }

          compilation.assets[baseTemplName] = source

          callback()
        }
      )
    })
  }

  private sortModules (modules: XMLModule[]) {
    const reg = /f(\d+)/
    modules.sort((a, b) => {
      const [, a1] = reg.exec(a._identifier)!
      const [, b1] = reg.exec(b._identifier)!
      return Number(a1) - Number(b1)
    })
  }
}
