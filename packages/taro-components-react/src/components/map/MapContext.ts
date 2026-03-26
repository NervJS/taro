/* eslint-disable no-console */
import { logPrefix } from './common'
import { MethodHandler } from './handler'

import type { MapContext as TaroMapContext } from '@tarojs/taro'
/**
 * 全局地图实例存储
 * key: Map 组件的 id
 * value: TMap.Map 实例
 */
const mapInstances = new Map<string, TMap.Map>()

/**
 * 注册地图实例（同时创建 MapContextImpl 并挂载到 window）
 * @param id Map 组件的 id
 * @param instance 地图实例
 */
export function registerMapInstance(id: string, instance: TMap.Map): void {
  mapInstances.set(id, instance)
  console.log(logPrefix, '[MapContext] 注册地图实例:', id, instance)

  // ✅ 方案 F：创建 MapContextImpl 并挂载到 window
  if (typeof window !== 'undefined') {
    // 确保 window 对象存在
    if (!(window as any).__TARO_MAP_CONTEXTS__) {
      (window as any).__TARO_MAP_CONTEXTS__ = new Map()
    }

    // ✅ 在这里 new MapContextImpl（有 TMap 类型）
    const contextImpl = new MapContextImpl(instance)

    // ✅ 存储 MapContextImpl 实例（不是 TMap.Map 实例）
    ;(window as any).__TARO_MAP_CONTEXTS__.set(id, contextImpl)

    console.log(logPrefix, '[MapContext] 挂载 MapContextImpl 到 window:', id)
  }
}

/**
 * 注销地图实例（同时清理 window）
 * @param id Map 组件的 id
 */
export function unregisterMapInstance(id: string): void {
  mapInstances.delete(id)
  console.log(logPrefix, '[MapContext] 注销地图实例:', id)

  // ✅ 从 window 清理 MapContextImpl
  if (typeof window !== 'undefined') {
    (window as any).__TARO_MAP_CONTEXTS__?.delete(id)
    console.log(logPrefix, '[MapContext] 从 window 清理 MapContextImpl:', id)
  }
}

/**
 * 获取地图实例
 * @param id Map 组件的 id
 * @returns 地图实例,如果不存在则返回 undefined
 */
export function getMapInstance(id: string): TMap.Map | undefined {
  return mapInstances.get(id)
}

/**
 * MapContext 实现类
 * 将腾讯地图 API 适配到 Taro MapContext 接口
 */
export class MapContextImpl implements TaroMapContext {
  private map: TMap.Map | null

  constructor(map: TMap.Map | null) {
    this.map = map
    if (!map) {
      console.warn(logPrefix, '[MapContext] 地图实例为空,部分方法将不可用')
    }
  }

  /**
   * 缩放视野包含所有经纬度
   * @supported weapp, tt
   */
  includePoints(option: TaroMapContext.IncludePointsOption): Promise<TaroGeneral.CallbackResult> {
    const handle = new MethodHandler({
      name: 'includePoints',
      success: option?.success,
      fail: option?.fail,
      complete: option?.complete,
    })

    if (!this.map) {
      return handle.fail({ errMsg: '地图实例不存在' })
    }

    try {
      const { points, padding } = option
      console.log(logPrefix, '[MapContext.includePoints] 开始执行:', { points, padding })

      // 创建空的 LatLngBounds
      const bounds = new TMap.LatLngBounds()
      // 转换坐标格式: {latitude, longitude} -> TMap.LatLng 并扩展边界
      points.forEach((p) => {
        const latLng = new TMap.LatLng(p.latitude, p.longitude)
        bounds.extend(latLng)
      })
      console.log(logPrefix, '[MapContext.includePoints] LatLngBounds:', bounds, 'padding:', padding)

      // 转换 padding 格式: Taro [top, right, bottom, left] -> TMap {top, right, bottom, left}
      let paddingOption: number | { top: number, right: number, bottom: number, left: number } | undefined
      if (padding) {
        if (Array.isArray(padding)) {
          // padding 是数组格式 [top, right, bottom, left]
          paddingOption = {
            top: padding[0],
            right: padding[1],
            bottom: padding[2],
            left: padding[3],
          }
        } else {
          // padding 是数字格式，直接使用
          paddingOption = padding as number
        }
      }

      // 调用地图的 fitBounds 方法
      this.map.fitBounds(bounds, {
        padding: paddingOption,
      })

      console.log(logPrefix, '[MapContext.includePoints] 执行成功')

      return handle.success({})
    } catch (error: any) {
      console.error(logPrefix, '[MapContext.includePoints] 执行失败:', error)
      return handle.fail({ errMsg: error?.message || String(error) })
    }
  }

  /**
   * 获取当前地图中心的经纬度
   * @supported weapp, tt
   */
  getCenterLocation(_option?: TaroMapContext.GetCenterLocationOption): Promise<TaroMapContext.GetCenterLocationSuccessCallbackResult> {
    console.warn(logPrefix, '[MapContext.getCenterLocation] 暂未实现')
    return Promise.reject(new Error('getCenterLocation: 暂未实现'))
  }

  /**
   * 设置定位点图标
   * @supported weapp, tt
   */
  setLocMarkerIcon(_option: TaroMapContext.SetLocMarkerIconOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.setLocMarkerIcon] 暂未实现')
    return Promise.reject(new Error('setLocMarkerIcon: 暂未实现'))
  }

  /**
   * 将地图中心移置当前定位点
   * @supported weapp, tt
   */
  moveToLocation(_option: TaroMapContext.MoveToLocationOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.moveToLocation] 暂未实现')
    return Promise.reject(new Error('moveToLocation: 暂未实现'))
  }

  /**
   * 平移marker,带动画
   * @supported weapp, tt
   */
  translateMarker(_option: TaroMapContext.TranslateMarkerOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.translateMarker] 暂未实现')
    return Promise.reject(new Error('translateMarker: 暂未实现'))
  }

  /**
   * 沿指定路径移动 marker
   */
  moveAlong(_object: any): void {
    console.warn(logPrefix, '[MapContext.moveAlong] 暂未实现')
  }

  /**
   * 获取当前地图的视野范围
   * @supported weapp, tt
   */
  getRegion(option?: TaroMapContext.GetRegionOption): Promise<TaroMapContext.GetRegionSuccessCallbackResult> {
    console.warn(logPrefix, '[MapContext.getRegion] 暂未实现', option)
    return Promise.reject(new Error('getRegion: 暂未实现'))
  }

  /**
   * 获取当前地图的旋转角
   * @supported weapp, tt
   */
  getRotate(option?: TaroMapContext.GetRotateOption): Promise<TaroMapContext.GetRotateSuccessCallbackResult> {
    console.warn(logPrefix, '[MapContext.getRotate] 暂未实现', option)
    return Promise.reject(new Error('getRotate: 暂未实现'))
  }

  /**
   * 获取当前地图的倾斜角
   * @supported weapp, tt
   */
  getSkew(option?: TaroMapContext.GetSkewOption): Promise<TaroMapContext.GetSkewSuccessCallbackResult> {
    console.warn(logPrefix, '[MapContext.getSkew] 暂未实现', option)
    return Promise.reject(new Error('getSkew: 暂未实现'))
  }

  /**
   * 获取当前地图的缩放级别
   * @supported weapp, tt
   */
  getScale(option?: TaroMapContext.GetScaleOption): Promise<TaroMapContext.GetScaleSuccessCallbackResult> {
    console.warn(logPrefix, '[MapContext.getScale] 暂未实现', option)
    return Promise.reject(new Error('getScale: 暂未实现'))
  }

  /**
   * 设置地图中心点偏移
   * @supported weapp, tt
   */
  setCenterOffset(option: TaroMapContext.SetCenterOffsetOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.setCenterOffset] 暂未实现', option)
    return Promise.reject(new Error('setCenterOffset: 暂未实现'))
  }

  /**
   * 移除个性化图层
   * @supported weapp
   */
  removeCustomLayer(option: TaroMapContext.RemoveCustomLayerOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.removeCustomLayer] 暂未实现', option)
    return Promise.reject(new Error('removeCustomLayer: 暂未实现'))
  }

  /**
   * 添加个性化图层
   * @supported weapp
   */
  addCustomLayer(option: TaroMapContext.AddCustomLayerOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.addCustomLayer] 暂未实现', option)
    return Promise.reject(new Error('addCustomLayer: 暂未实现'))
  }

  /**
   * 创建自定义图片图层
   * @supported weapp, tt
   */
  addGroundOverlay(option: TaroMapContext.AddGroundLayerOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.addGroundOverlay] 暂未实现', option)
    return Promise.reject(new Error('addGroundOverlay: 暂未实现'))
  }

  /**
   * 添加可视化图层
   * @supported weapp
   */
  addVisualLayer(option: TaroMapContext.AddVisualLayerOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.addVisualLayer] 暂未实现', option)
    return Promise.reject(new Error('addVisualLayer: 暂未实现'))
  }

  /**
   * 移除可视化图层
   * @supported weapp
   */
  removeVisualLayer(option: TaroMapContext.RemoveVisualLayerOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.removeVisualLayer] 暂未实现', option)
    return Promise.reject(new Error('removeVisualLayer: 暂未实现'))
  }

  /**
   * 添加弧线
   * @supported weapp
   */
  addArc(option: TaroMapContext.AddArcOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.addArc] 暂未实现', option)
    return Promise.reject(new Error('addArc: 暂未实现'))
  }

  /**
   * 删除弧线
   * @supported weapp
   */
  removeArc(option: TaroMapContext.RemoveArcOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.removeArc] 暂未实现', option)
    return Promise.reject(new Error('removeArc: 暂未实现'))
  }

  /**
   * 限制地图的显示范围
   * @supported weapp
   */
  setBoundary(option: TaroMapContext.SetBoundaryOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.setBoundary] 暂未实现', option)
    return Promise.reject(new Error('setBoundary: 暂未实现'))
  }

  /**
   * 更新自定义图片图层
   * @supported weapp, tt
   */
  updateGroundOverlay(option: TaroMapContext.UpdateGroundOverlayOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.updateGroundOverlay] 暂未实现', option)
    return Promise.reject(new Error('updateGroundOverlay: 暂未实现'))
  }

  /**
   * 移除自定义图片图层
   * @supported weapp, tt
   */
  removeGroundOverlay(option: TaroMapContext.RemoveGroundOverlayOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.removeGroundOverlay] 暂未实现', option)
    return Promise.reject(new Error('removeGroundOverlay: 暂未实现'))
  }

  /**
   * 获取经纬度对应的屏幕坐标
   * @supported weapp
   */
  toScreenLocation(option: TaroMapContext.ToScreenLocationOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.toScreenLocation] 暂未实现', option)
    return Promise.reject(new Error('toScreenLocation: 暂未实现'))
  }

  /**
   * 获取屏幕上的点对应的经纬度
   * @supported weapp
   */
  fromScreenLocation(option: TaroMapContext.FromScreenLocationOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.fromScreenLocation] 暂未实现', option)
    return Promise.reject(new Error('fromScreenLocation: 暂未实现'))
  }

  /**
   * 拉起地图APP选择导航
   * @supported weapp
   */
  openMapApp(option: TaroMapContext.OpenMapAppOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.openMapApp] 暂未实现', option)
    return Promise.reject(new Error('openMapApp: 暂未实现'))
  }

  /**
   * 添加 marker
   * @supported weapp
   */
  addMarkers(option: TaroMapContext.AddMarkersOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.addMarkers] 暂未实现', option)
    return Promise.reject(new Error('addMarkers: 暂未实现'))
  }

  /**
   * 移除 marker
   * @supported weapp
   */
  removeMarkers(option: TaroMapContext.RemoveMarkersOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.removeMarkers] 暂未实现', option)
    return Promise.reject(new Error('removeMarkers: 暂未实现'))
  }

  /**
   * 初始化点聚合的配置
   * @supported weapp
   */
  initMarkerCluster(option?: TaroMapContext.InitMarkerClusterOption): Promise<TaroGeneral.CallbackResult> {
    console.warn(logPrefix, '[MapContext.initMarkerCluster] 暂未实现', option)
    return Promise.reject(new Error('initMarkerCluster: 暂未实现'))
  }

  /**
   * 监听地图事件
   * @supported weapp
   */
  on(
    event: keyof TaroMapContext.MapEvent,
    callback: (res: TaroMapContext.MapEvent[keyof TaroMapContext.MapEvent]) => void
  ): void {
    console.warn(logPrefix, '[MapContext.on] 暂未实现', event, callback)
  }
}

export { MapContextImpl as MapContext }
