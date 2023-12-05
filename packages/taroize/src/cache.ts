import { cloneDeep } from 'lodash'

import { Wxml } from './wxml'

const cacheMap = new Map<string, Wxml>()

export function getCacheWxml (dirpath: string, wxml: any): Wxml | undefined {
  if (wxml === cacheMap.get(dirpath)?.wxml)
    return cloneDeep(cacheMap.get(dirpath))
}

export function saveCacheWxml (dirpath: string, wxml: Wxml) {
  cacheMap.set(dirpath, cloneDeep(wxml))
}
