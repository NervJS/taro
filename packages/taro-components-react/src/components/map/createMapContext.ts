/* eslint-disable no-console */
import { getMapInstance, MapContextImpl } from './MapContext'

import type { MapContext as TaroMapContext } from '@tarojs/taro'

/**
 * 创建 MapContext 实例
 *
 * @param mapId Map 组件的 id
 * @param component 在自定义组件下的当前组件实例的this (H5端暂不支持)
 * @returns MapContext 实例
 *
 * @example
 * ```tsx
 * function TestComponent() {
 *   return (
 *     <>
 *       <Map id="myMap" longitude={116.2735} latitude={40.0404} />
 *       <Button onClick={() => {
 *         const mapCtx = createMapContext('myMap')
 *         mapCtx.includePoints({
 *           points: [
 *             { latitude: 40.0404, longitude: 116.2735 },
 *             { latitude: 40.0504, longitude: 116.2735 }
 *           ]
 *         })
 *       }}>
 *         缩放视野
 *       </Button>
 *     </>
 *   )
 * }
 * ```
 */
export function createMapContext(
  mapId: string,
  component?: any
): TaroMapContext {
  console.log('[createMapContext] 创建 MapContext:', { mapId, component })

  const mapInstance = getMapInstance(mapId)

  if (!mapInstance) {
    console.warn(`[createMapContext] 找不到 id 为 "${mapId}" 的地图实例`)
    console.warn('[createMapContext] 请确保:')
    console.warn('  1. Map 组件已经渲染完成')
    console.warn('  2. Map 组件设置了正确的 id')
    console.warn('  3. 在 onAuthSuccess 回调中调用此方法')

    // 返回一个空实现,避免运行时错误
    return new MapContextImpl(null)
  }

  console.log('[createMapContext] 成功获取地图实例')
  return new MapContextImpl(mapInstance)
}

export default createMapContext
