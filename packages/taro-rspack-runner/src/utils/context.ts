import { META_TYPE } from '@tarojs/helper'
import { createComponentConfig } from '@tarojs/runner-utils'

import type { Func } from '@tarojs/taro/types/compile'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'

export interface IModuleComponentMeta {
  elementNames: Set<string>
  componentNames: Set<string>
  thirdPartyProps: Map<string, Set<string>>
}

export const componentConfig: IComponentConfig = createComponentConfig()

export const elementNameSet = new Set<string>()
export const componentNameSet = new Set<string>()
export const moduleComponentMetaMap = new Map<string, IModuleComponentMeta>()

export function syncModuleComponentMetas (onParseCreateElement?: Func) {
  for (const meta of moduleComponentMetaMap.values()) {
    for (const elName of meta.elementNames) {
      elementNameSet.add(elName)
      onParseCreateElement?.(elName, componentConfig)
    }

    for (const compName of meta.componentNames) {
      componentNameSet.add(compName)
      if (compName === 'CustomWrapper' && !componentConfig.thirdPartyComponents.get('custom-wrapper')) {
        componentConfig.thirdPartyComponents.set('custom-wrapper', new Set())
      }
    }

    for (const [tag, props] of meta.thirdPartyProps.entries()) {
      const attrs = componentConfig.thirdPartyComponents.get(tag)
      if (attrs) {
        props.forEach(p => attrs.add(p))
      }
    }
  }
}

export interface IMiniEntryMeta {
  name: string
  entryPath: string
  miniType: META_TYPE
  options: Record<string, any>
  isNativePage?: boolean
}

export interface ITaroLoaderResolved {
  loader: string
  options: Record<string, any>
}

export type MiniEntryLoaderResolver = (entryName: string, resourcePath: string) => ITaroLoaderResolved | null
export type H5EntryLoaderResolver = (resourcePath: string) => ITaroLoaderResolved | null

let currentMiniEntryMetaMap = new Map<string, IMiniEntryMeta>()
let currentMiniEntryLoaderResolver: MiniEntryLoaderResolver | null = null
let currentH5EntryLoaderResolver: H5EntryLoaderResolver | null = null

export function setMiniEntryContext (
  metaMap: Map<string, IMiniEntryMeta>,
  resolver: MiniEntryLoaderResolver
) {
  currentMiniEntryMetaMap = metaMap
  currentMiniEntryLoaderResolver = resolver
}

export function getMiniEntryMeta (entryName: string): IMiniEntryMeta | undefined {
  return currentMiniEntryMetaMap.get(entryName)
}

export function resolveMiniEntryLoader (entryName: string, resourcePath: string): ITaroLoaderResolved | null {
  return currentMiniEntryLoaderResolver ? currentMiniEntryLoaderResolver(entryName, resourcePath) : null
}

export function setH5EntryLoaderResolver (resolver: H5EntryLoaderResolver | null) {
  currentH5EntryLoaderResolver = resolver
}

export function resolveH5EntryLoader (resourcePath: string): ITaroLoaderResolved | null {
  return currentH5EntryLoaderResolver ? currentH5EntryLoaderResolver(resourcePath) : null
}

export const TARO_ENTRY_QUERY_KEY = '__taro_entry__'
export const TARO_TEMPLATE_QUERY_KEY = '__taro_template__'

export function buildEntryRequestWithQuery (entryPath: string, entryName: string): string {
  const sep = entryPath.includes('?') ? '&' : '?'
  return `${entryPath}${sep}${TARO_ENTRY_QUERY_KEY}=${encodeURIComponent(entryName)}`
}

export function parseEntryNameFromQuery (resourceQuery = ''): string | null {
  if (!resourceQuery) return null
  const queryStr = resourceQuery.startsWith('?') ? resourceQuery.slice(1) : resourceQuery
  const params = new URLSearchParams(queryStr)
  return params.get(TARO_ENTRY_QUERY_KEY)
}

export function buildTemplateRequestWithQuery (
  anchorPath: string,
  templateName: 'comp' | 'comp-new-blended' | 'custom-wrapper'
): string {
  const sep = anchorPath.includes('?') ? '&' : '?'
  return `${anchorPath}${sep}${TARO_TEMPLATE_QUERY_KEY}=${encodeURIComponent(templateName)}`
}

export function parseTemplateNameFromQuery (resourceQuery = ''): string | null {
  if (!resourceQuery) return null
  const queryStr = resourceQuery.startsWith('?') ? resourceQuery.slice(1) : resourceQuery
  const params = new URLSearchParams(queryStr)
  return params.get(TARO_TEMPLATE_QUERY_KEY)
}
