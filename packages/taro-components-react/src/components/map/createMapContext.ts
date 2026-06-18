import { getMapInstance, MapContextImpl } from './MapContext'

/**
 * 创建地图上下文 MapContext 对象
 *
 * @deprecated 请使用 Taro.createMapContext 代替
 *
 * 此导出仅用于向后兼容，将在未来版本中移除。
 *
 * 推荐用法：
 * ```tsx
 * import Taro from '@tarojs/taro'
 *
 * const mapCtx = Taro.createMapContext('mapId')
 * ```
 *
 * @param mapId Map 组件的 id
 * @param component 自定义组件实例（暂未使用）
 * @returns MapContext 实例
 */
export function createMapContext(
  mapId: string,
  _component?: any
): MapContextImpl {
  // 获取地图实例
  const mapInstance = getMapInstance(mapId)

  if (!mapInstance) {
    console.warn(
      '[createMapContext] 找不到 id 为 "' + mapId + '" 的地图实例，' +
      '请确保：1) Map 组件已正确设置 id 属性；2) 地图已完成初始化'
    )
    // 返回一个空实现，避免运行时错误
    return new MapContextImpl(null)
  }

  // 创建并返回 MapContextImpl 实例
  return new MapContextImpl(mapInstance)
}
