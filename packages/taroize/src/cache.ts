import { Wxml } from './wxml'
import { cloneDeep } from 'lodash'
const cacheMap = new Map()

 export function getCacheWxml(dirpath: string): Wxml {
    return cloneDeep(cacheMap.get(dirpath))
}

 export function saveCacheWxml(dirpath: string, wxml: Wxml) {
    if (!dirpath) {
        return
    }
    cacheMap.set(dirpath, cloneDeep(wxml))
} 