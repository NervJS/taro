/* eslint-disable no-console */
import Taro from '@tarojs/api'

/**
 * 创建地图上下文 MapContext 对象
 *
 * 通过 window.__TARO_MAP_CONTEXTS__ 获取 MapContextImpl 实例
 * 该实例由 @tarojs/components-react 在地图初始化时创建并挂载
 */
export const createMapContext: typeof Taro.createMapContext = (
  mapId: string,
  _inst?: any
): Taro.MapContext => {
  // ✅ 从 window 获取 MapContextImpl 实例（不是 TMap.Map 实例）
  const contextImpl = (window as any).__TARO_MAP_CONTEXTS__?.get(mapId) as Taro.MapContext

  if (!contextImpl) {
    console.warn(`[createMapContext] 找不到 id 为 "${mapId}" 的地图上下文`)
    console.warn('[createMapContext] 请确保：1) Map 组件已正确设置 id 属性；2) 地图已完成初始化')
    // 返回一个空实现，避免运行时错误
    return createDummyContext()
  }

  console.log('[createMapContext] 成功获取地图上下文:', mapId)
  return contextImpl
}

/**
 * 创建空实现（当找不到地图实例时）
 * 避免业务代码调用时出现运行时错误
 */
function createDummyContext(): Taro.MapContext {
  console.warn('[createDummyContext] 返回空 MapContext 实现')
  return {
    includePoints: () => Promise.reject(new Error('地图实例不存在')),
    getCenterLocation: () => Promise.reject(new Error('地图实例不存在')),
    setLocMarkerIcon: () => Promise.reject(new Error('地图实例不存在')),
    moveToLocation: () => Promise.reject(new Error('地图实例不存在')),
    translateMarker: () => Promise.reject(new Error('地图实例不存在')),
    moveAlong: () => {
      console.warn('[MapContext] moveAlong: 地图实例不存在')
    },
    getRegion: () => Promise.reject(new Error('地图实例不存在')),
    getRotate: () => Promise.reject(new Error('地图实例不存在')),
    getSkew: () => Promise.reject(new Error('地图实例不存在')),
    getScale: () => Promise.reject(new Error('地图实例不存在')),
    setCenterOffset: () => Promise.reject(new Error('地图实例不存在')),
    removeCustomLayer: () => Promise.reject(new Error('地图实例不存在')),
    addCustomLayer: () => Promise.reject(new Error('地图实例不存在')),
    addGroundOverlay: () => Promise.reject(new Error('地图实例不存在')),
    addVisualLayer: () => Promise.reject(new Error('地图实例不存在')),
    removeVisualLayer: () => Promise.reject(new Error('地图实例不存在')),
    addArc: () => Promise.reject(new Error('地图实例不存在')),
    removeArc: () => Promise.reject(new Error('地图实例不存在')),
    setBoundary: () => Promise.reject(new Error('地图实例不存在')),
    updateGroundOverlay: () => Promise.reject(new Error('地图实例不存在')),
    removeGroundOverlay: () => Promise.reject(new Error('地图实例不存在')),
    toScreenLocation: () => Promise.reject(new Error('地图实例不存在')),
    fromScreenLocation: () => Promise.reject(new Error('地图实例不存在')),
    openMapApp: () => Promise.reject(new Error('地图实例不存在')),
    addMarkers: () => Promise.reject(new Error('地图实例不存在')),
    removeMarkers: () => Promise.reject(new Error('地图实例不存在')),
    initMarkerCluster: () => Promise.reject(new Error('地图实例不存在')),
    on: (_event: any, _callback: any) => {
      console.warn('[MapContext] on: 地图实例不存在')
    },
  }
}
