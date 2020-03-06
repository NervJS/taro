import * as path from 'path'

import webpack, { compilation } from 'webpack'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'

import { PARSE_AST_TYPE, REG_STYLE, BUILD_TYPES } from '../utils/constants'
import { promoteRelativePath } from '../utils'
import { AddPageChunks, IComponent, IComponentObj } from '../utils/types'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

interface IOptions {
  commonChunks: string[],
  buildAdapter: BUILD_TYPES,
  isBuildPlugin: boolean,
  addChunkPages?: AddPageChunks,
  pages: Set<IComponent>,
  depsMap: Map<string, Set<IComponentObj>>
  sourceDir: string
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  buildAdapter: BUILD_TYPES
  isBuildPlugin: boolean
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>,
  depsMap: Map<string, Set<IComponentObj>>
  sourceDir: string

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
    this.buildAdapter = options.buildAdapter
    this.isBuildPlugin = options.isBuildPlugin
    this.addChunkPages = options.addChunkPages
    this.pages = options.pages
    this.depsMap = options.depsMap
    this.sourceDir = options.sourceDir
  }

  apply (compiler: webpack.Compiler) {
    const pagesList = this.pages
    const addChunkPagesList = new Map<string, string[]>()
    const depsMap = this.depsMap
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      let commonChunks
      let fileChunks = new Map()
      let allDepsComponents = new Set()
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: compilation.Chunk[]) => {
        commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name)).reverse()
        this.addChunkPages(addChunkPagesList, Array.from(pagesList).map((item: any) => item.name))
        chunks.forEach(chunk => {
          const id = getIdOrName(chunk)
          addChunkPagesList.forEach((v, k) => {
            if (k === id) {
              const depChunks = v.map(v => ({ name: v }))
              fileChunks.set(id, depChunks)
              let entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
              if (entryModule) {
                const depsComponents = getAllDepComponents(entryModule.resource, depsMap)
                depsComponents.forEach(component => {
                  const id = component.path.replace(this.sourceDir + path.sep, '').replace(path.extname(component.path), '').replace(/\\{1,}/g, '/')
                  const oriDep = fileChunks.get(id) || []
                  fileChunks.set(id, Array.from(new Set([...oriDep, ...depChunks])))
                })
              }
            }
          })
        })
      })
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (chunk.entryModule) {
          if (this.isBuildPlugin) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          let entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
          if (entryModule.miniType === PARSE_AST_TYPE.ENTRY) {
            compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, assets => {
              const files = chunk.files
              files.forEach(item => {
                if (REG_STYLE.test(item)) {
                  const source = new ConcatSource()
                  const _source = assets[item]._source || assets[item]._value
                  Object.keys(assets).forEach(assetName => {
                    const fileName = path.basename(assetName, path.extname(assetName))
                    if (REG_STYLE.test(assetName) && this.commonChunks.includes(fileName)) {
                      source.add(`@import ${JSON.stringify(urlToRequest(assetName))};`)
                      source.add('\n')
                      source.add(_source)
                      if (assets[item]._source) {
                        assets[item]._source = source
                      } else {
                        assets[item]._value = source.source()
                      }
                    }
                  })
                }
              })
            })
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          if ((this.buildAdapter === BUILD_TYPES.QUICKAPP) &&
            (entryModule.miniType === PARSE_AST_TYPE.PAGE ||
            entryModule.miniType === PARSE_AST_TYPE.COMPONENT)) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          if (fileChunks.size
            && (entryModule.miniType === PARSE_AST_TYPE.PAGE
            || entryModule.miniType === PARSE_AST_TYPE.COMPONENT)) {
            let source
            const id = getIdOrName(chunk)
            fileChunks.forEach((v, k) => {
              if (k === id) {
                source = addRequireToSource(id, modules, v)
              }
            })
            return source
          }
        }
      })
    })
  }
}

function getIdOrName (chunk) {
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return chunk.name
}

function getAllDepComponents (filePath, depsMap) {
  let componentsList = new Set<IComponentObj>()
  depsMap.forEach((value, key) => {
    if (filePath === key) {
      componentsList = new Set<IComponentObj>([...componentsList, ...value])
      value.forEach(item => {
        componentsList = new Set<IComponentObj>([...componentsList, ...getAllDepComponents(item.path, depsMap)])
      })
    }
  })
  return componentsList
}

function addRequireToSource (id, modules, commonChunks) {
  const source = new ConcatSource()
  commonChunks.forEach(chunkItem => {
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name)))});\n`)
  })
  source.add('\n')
  source.add(modules)
  source.add(';')
  return source
}
