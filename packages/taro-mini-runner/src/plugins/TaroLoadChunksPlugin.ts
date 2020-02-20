import * as path from 'path'

import webpack from 'webpack'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'
import { promoteRelativePath, META_TYPE, REG_STYLE, BUILD_TYPES, taroJsComponents } from '@tarojs/runner-utils'

import { componentConfig } from '../template/component'
import { toDashed } from '@tarojs/shared'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

interface IOptions {
  commonChunks: string[],
  buildAdapter: BUILD_TYPES,
  isBuildPlugin: boolean,
  framework: string
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  buildAdapter: BUILD_TYPES
  isBuildPlugin: boolean
  framework: string

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
    this.buildAdapter = options.buildAdapter
    this.isBuildPlugin = options.isBuildPlugin
    this.framework = options.framework
  }

  apply (compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      let commonChunks
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: webpack.compilation.Chunk[]) => {
        commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name)).reverse()

        const vendor = chunks.find(c => c.name === 'vendors')
        if (vendor == null) {
          return
        }

        (vendor.modulesIterable as Set<unknown>).forEach((m: { rawRequest: string, usedExports: string[] }) => {
          if (m.rawRequest === taroJsComponents) {
            const includes = componentConfig.includes
            m.usedExports.map(toDashed).map(includes.add.bind(includes))
          }
        })
      })
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (chunk.entryModule) {
          if (this.isBuildPlugin) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          let entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
          if (entryModule.miniType === META_TYPE.ENTRY) {
            compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, assets => {
              const files = chunk.files
              files.forEach(item => {
                if (REG_STYLE.test(item)) {
                  const source = new ConcatSource()
                  const _source = assets[item]._source
                  Object.keys(assets).forEach(assetName => {
                    const fileName = path.basename(assetName, path.extname(assetName))
                    if (REG_STYLE.test(assetName) && this.commonChunks.includes(fileName)) {
                      source.add(`@import ${JSON.stringify(urlToRequest(assetName))}`)
                      source.add('\n')
                      source.add(_source)
                      assets[item]._source = source
                    }
                  })
                }
              })
            })
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          if ((this.buildAdapter === BUILD_TYPES.QUICKAPP) &&
            (entryModule.miniType === META_TYPE.PAGE ||
            entryModule.miniType === META_TYPE.COMPONENT)) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
        }
      })
    })
  }
}

function getIdOrName (chunk: webpack.compilation.Chunk) {
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return chunk.name
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
