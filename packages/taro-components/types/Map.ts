import { ComponentType } from 'react'
import { StandardProps, BaseEventFunction } from './common'

/**
 * 地图。
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map
 */
interface MapProps extends StandardProps {

  /**
   * 中心经度
   */
  longitude: number,

  /**
   * 中心纬度
   */
  latitude: number,

  /**
   * 缩放级别，取值范围为5-18
   * 默认值：`16`
   */
  scale?: number,

  /**
   * 标记点
   */
  markers?: [],

  /**
   * @deprecated
   * 即将移除，请使用 markers
   */
  covers?: [],

  /**
   * 路线
   */
  polyline?: [],

  /**
   * 圆
   */
  circles?: [],

  /**
   * 控件
   */
  controls?: [],

  /**
   * 缩放视野以包含所有给定的坐标点
   */
  includePoints?: [],

  /**
   * 显示带有方向的当前定位点
   */
  showLocation?: boolean,

  /**
   * 点击标记点时触发，会返回marker的id
   */
  onMarkerTap?: BaseEventFunction,

  /**
   * @since 1.2.0
   * 点击标记点对应的气泡时触发，会返回 marker 的 id
   */
  onCalloutTap?: BaseEventFunction,

  /**
   * 点击控件时触发，会返回 control 的 id
   */
  onCcontrolTap?: BaseEventFunction,

  /**
   * 视野发生变化时触发
   */
  onRegionChange?: BaseEventFunction,

  /**
   * @since 1.6.0
   * 在地图渲染更新完成时触发
   */
  onUpdated?: BaseEventFunction
}

declare const Map: ComponentType<MapProps>

export { Map }
