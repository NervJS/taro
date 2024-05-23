import Taro from '@tarojs/taro'

import { findDOM } from '../../utils'
import { HosMapContext } from './HosMapContext'
import { MapContext } from './MapContext'

/**
 * 创建 map 上下文 MapContext 对象。
 *
 * @canUse createMapContext
 */
export const createMapContext: typeof Taro.createMapContext = (id, inst, isHosMap = true) => {
  let el = findDOM(inst) as HTMLDivElement | undefined
  if (!el) {
    el = window.document.getElementById(id) as HTMLDivElement
  }
  if (isHosMap) {
    const mapEmbedId = (el.querySelector(`div[id=${id}]`)?.childNodes[0] as HTMLEmbedElement).id
    const context = new HosMapContext(mapEmbedId)
    return context
  } else {
    const Map = el.querySelector(`taro-map-core[id=${id}]`) as unknown as Taro.MapContext
    const context = new MapContext(Map)
    return context
  }
}