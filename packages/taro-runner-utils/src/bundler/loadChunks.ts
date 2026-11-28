import path from 'node:path'

import { META_TYPE, promoteRelativePath } from '@tarojs/helper'

import type { AppConfig } from '@tarojs/taro'
import type { AddPageChunks, IBundlerSources, IComponent } from './types'

/**
 * 在文本头部加入一些 require 语句
 */
export function addRequireToSourceWith (
  ConcatSource: IBundlerSources['ConcatSource'],
  id: string,
  modules: any,
  commonChunks: Array<{ name?: string | null }>,
  appConfig?: AppConfig
) {
  const source = new ConcatSource()
  if (process.env.TARO_ENV === 'tt' && appConfig) {
    source.add(`
if (typeof tt !== 'undefined') {
  tt.__$enableTTDom$__ = ${appConfig.enableTTDom};
}\n`)
  }
  commonChunks.forEach(chunkItem => {
    if (!chunkItem?.name) {
      return
    }
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name)))});\n`)
  })
  source.add('\n')
  source.add(modules)
  source.add(';')
  return source
}

export function getChunkEntryModuleFromCompilation (compilation: any, chunk: any) {
  const chunkGraph = compilation?.chunkGraph
  if (!chunkGraph?.getChunkEntryModulesIterable) {
    return undefined
  }
  const entryModules = Array.from(chunkGraph.getChunkEntryModulesIterable(chunk))
  if (entryModules.length) {
    return entryModules[0]
  }
}

export function errorHandling (errorLevel?: number, stats?: { hasErrors: () => boolean } | null) {
  if (errorLevel === 1 && stats?.hasErrors()) {
    process.exit(1)
  }
}

export interface IBaseLoadChunksPluginOptions {
  commonChunks: string[]
  isBuildPlugin: boolean
  framework: string
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>
  needAddCommon?: string[]
  isIndependentPackages?: boolean
  appConfig?: AppConfig
}

export abstract class BaseLoadChunksPlugin {
  commonChunks: string[]
  isBuildPlugin: boolean
  framework: string
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>
  needAddCommon: string[] = []
  isIndependentPackages = false
  appConfig?: AppConfig

  constructor (options: IBaseLoadChunksPluginOptions) {
    Object.assign(this, options)
    this.needAddCommon = options.needAddCommon || []
    this.isIndependentPackages = options.isIndependentPackages || false
  }

  protected collectAddChunkPagesDeps (
    chunksArray: any[],
    getChunkId: (chunk: any) => string,
    addChunkPagesList: Map<string, string[]> = new Map()
  ): Map<string, { name: string }[]> {
    const fileChunks = new Map<string, { name: string }[]>()
    if (typeof this.addChunkPages === 'function') {
      this.addChunkPages(addChunkPagesList, Array.from(this.pages).map(item => item.name))
      chunksArray.forEach(chunk => {
        const id = getChunkId(chunk)
        addChunkPagesList.forEach((deps, pageName) => {
          if (pageName === id) {
            const depChunks = deps.map(dep => ({ name: dep }))
            fileChunks.set(id, depChunks)
          }
        })
      })
    }
    return fileChunks
  }

  abstract apply (compiler: any): void
}

export function transformEntryChunkSource (opts: {
  chunkName: string
  miniType?: META_TYPE
  isNativePage?: boolean
  source: any
  commonChunks: Array<{ name?: string | null }>
  fileChunks: Map<string, { name: string }[]>
  isBuildPlugin: boolean
  needAddCommon: string[]
  isIndependentPackages: boolean
  appConfig?: AppConfig
  ConcatSource: IBundlerSources['ConcatSource']
}) {
  const { chunkName, miniType, isNativePage = false, commonChunks, fileChunks, isBuildPlugin, needAddCommon, isIndependentPackages, appConfig, ConcatSource } = opts
  let updated = opts.source

  if (miniType === META_TYPE.EXPORTS) {
    const wrapped = new ConcatSource()
    wrapped.add('module.exports=')
    wrapped.add(updated)
    updated = wrapped
  }

  if (isBuildPlugin) {
    return addRequireToSourceWith(ConcatSource, chunkName, updated, commonChunks)
  }

  if (needAddCommon.includes(chunkName)) {
    return addRequireToSourceWith(ConcatSource, chunkName, updated, commonChunks)
  }

  if (miniType === META_TYPE.ENTRY) {
    return addRequireToSourceWith(ConcatSource, chunkName, updated, commonChunks, appConfig)
  }

  if (
    isIndependentPackages &&
    (miniType === META_TYPE.PAGE || miniType === META_TYPE.COMPONENT || isNativePage)
  ) {
    return addRequireToSourceWith(ConcatSource, chunkName, updated, commonChunks)
  }

  if (fileChunks.size && (miniType === META_TYPE.PAGE || miniType === META_TYPE.COMPONENT)) {
    const extraDeps = fileChunks.get(chunkName)
    if (extraDeps) {
      return addRequireToSourceWith(ConcatSource, chunkName, updated, extraDeps)
    }
  }

  return updated
}
