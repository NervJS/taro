import Taro from '@tarojs/taro'

import { findDOM } from '../../../utils'
import { MapContext } from './MapContext'

// 地图
export const createMapContext: typeof Taro.createMapContext = (id, inst) => {
  const el = findDOM(inst) as HTMLDivElement 
  const Map = el?.querySelector(`taro-map-core[id=${id}]`) as unknown as Taro.MapContext
  const context = new MapContext(Map)
  return context
}
