import {
  errorHandling,
  getChunkEntryModuleFromCompilation
} from '@tarojs/runner-utils/bundler/loadChunks'

import type { Chunk, Compilation, EntryObject } from '@rspack/core'
import type {
  AddPageChunks,
  CommonBuildConfig as BaseCommonBuildConfig,
  IChain,
  IComponent,
  IComponentObj,
  IFileType,
  IH5BuildConfig as BaseH5BuildConfig,
  IMiniBuildConfig as BaseMiniBuildConfig,
  IOption
} from '@tarojs/runner-utils/bundler/types'

export type { AddPageChunks, IChain, IComponent, IComponentObj, IFileType, IOption }

export type CommonBuildConfig = BaseCommonBuildConfig<EntryObject>
export type IMiniBuildConfig = BaseMiniBuildConfig<EntryObject>
export type IH5BuildConfig = BaseH5BuildConfig<EntryObject>

export { errorHandling }
export const getChunkEntryModule = getChunkEntryModuleFromCompilation

export function getChunkIdOrName (chunk: Chunk): string {
  if (chunk.name) {
    return chunk.name
  }
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return String(chunk.id ?? '')
}

export function chunkHasJs (chunk: Chunk, compilation: Compilation): boolean {
  if (chunk.files) {
    for (const file of chunk.files) {
      if (file.endsWith('.js')) return true
    }
  }
  if (chunk.name && compilation.assets[`${chunk.name}.js`]) {
    return true
  }
  if (typeof chunk.runtime === 'string' && chunk.name === chunk.runtime) return true
  if (chunk.name && typeof (chunk.runtime as any)?.has === 'function' && (chunk.runtime as any).has(chunk.name)) return true
  const chunkGraph = compilation.chunkGraph
  if (chunkGraph?.getNumberOfEntryModules && chunkGraph.getNumberOfEntryModules(chunk) > 0) return true
  return false
}

export function wrapAssetsForModifyHook (assets: Record<string, any>) {
  if (!assets || typeof assets !== 'object') return assets
  return new Proxy(assets, {
    get (target, prop, receiver) {
      if (prop === Symbol.toPrimitive || prop === 'toString') {
        return () => '[object CompilationAssets]'
      }
      if (prop === 'valueOf') {
        return () => target
      }
      return Reflect.get(target, prop, receiver)
    }
  })
}
