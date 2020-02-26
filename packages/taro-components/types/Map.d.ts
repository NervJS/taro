import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export type callout = {

  /** 文本
   */
  content: string

  /** 文本颜色
   */
  color: string

  /** 文字大小
   */
  fontSize: number

  /** 边框圆角
   */
  borderRadius: number

  /** 边框宽度
   */
  borderWidth: number

  /** 边框颜色
   */
  borderColor: string

  /** 背景色
   */
  bgColor: string

  /** 文本边缘留白
   */
  padding: number

  /** 'BYCLICK':点击显示; 'ALWAYS':常显
   */
  display: 'BYCLICK' | 'ALWAYS'

  /** 文本对齐方式。有效值: left, right, center
   */
  textAlign: 'left' | 'right' | 'center'
}

export type label = {

  /** 文本
   */
  content: string

  /** 文本颜色
   */
  color: string

  /** 文字大小
   */
  fontSize: number

  /** label的坐标，原点是 marker 对应的经纬度
   */
  anchorX: number

  /** label的坐标，原点是 marker 对应的经纬度
   */
  anchorY: number

  /** 边框宽度
   */
  borderWidth: number

  /** 边框颜色
   */
  borderColor: string

  /** 边框圆角
   */
  borderRadius: number

  /** 背景色
   */
  bgColor: string

  /** 文本边缘留白
   */
  padding: number

  /** 文本对齐方式。有效值: left, right, center
   */
  textAlign: 'left' | 'right' | 'center'
}

export type marker = {

  /** 标记点id
   *
   * 备注：marker 点击事件回调会返回此id。建议为每个 marker 设置上 Number 类型 id，保证更新 marker 时有更好的性能。
   */
  id?: number

  /** 纬度
   *
   * 备注：浮点数，范围 -90 ~ 90
   */
  latitude: number

  /** 经度
   *
   * 备注：浮点数，范围 -180 ~ 180
   */
  longitude: number

  /** 标注点名
   */
  title?: string

  /** 显示层级
   */
  zIndex?: number

  /** 显示的图标
   *
   * 备注：项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径和网络图片
   */
  iconPath: string

  /** 旋转角度
   *
   * 备注：顺时针旋转的角度，范围 0 ~ 360，默认为 0
   */
  rotate?: number

  /** 标注的透明度
   *
   * 备注：默认1，无透明，范围 0 ~ 1
   */
  alpha?: number

  /** 标注图标宽度
   *
   * 备注：默认为图片实际宽度
   */
  width?: number

  /** 标注图标高度
   *
   * 备注：默认为图片实际高度
   */
  height?: number

  /** 自定义标记点上方的气泡窗口
   *
   * 备注：支持的属性见下表，可识别换行符。
   */
  callout?: callout

  /** 为标记点旁边增加标签
   *
   * 备注：支持的属性见下表，可识别换行符。
   */
  label?: label

  /** 经纬度在标注图标的锚点，默认底边中点
   *
   * 备注：{x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点
   */
  anchor?: {
    x: number
    y: number
  }
}

/** 地图。
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map
 * @see https://smartprogram.baidu.com/docs/develop/component/map/#map
 * @see https://docs.alipay.com/mini/component/map
 */
interface MapProps extends StandardProps {

  /** 中心经度
   */
  longitude: number

  /** 中心纬度
   */
  latitude: number

  /** 缩放级别，取值范围为5-18 (baidu: 4-21)
   * 默认值：`16`
   */
  scale?: number

  /** 标记点
   */
  markers?: marker[]

  /** @deprecated
   * 即将移除，请使用 markers
   * @from wechat
   */
  covers?: any[]

  /** 路线
   */
  polyline?: any[]

  /** 圆
   */
  circles?: any[]

  /** 控件（即将废弃，建议使用 cover-view 代替）
   */
  controls?: any[]

  /** 缩放视野以包含所有给定的坐标点
   */
  includePoints?: any[]

  /** 显示带有方向的当前定位点
   * 默认值：`false`
   */
  showLocation?: boolean

  /** 多边形
   * @since 2.3.0
   */
  polygons?: any[]

  /** 个性化地图使用的 key
   * @since 2.3.0
   * @from wechat
   */
  subkey?: string

  /** 个性化地图配置的 style，不支持动态修改
   * 默认值：`1`
   * @from wechat
   */
  layerStyle?: number

  /** 旋转角度，范围 0 ~ 360, 地图正北和设备 y 轴角度的夹角
   * 默认值：`0`
   * @since 2.5.0
   * @from wechat
   */
  rotate?: number

  /** 倾斜角度，范围 0 ~ 40 , 关于 z 轴的倾角
   * 默认值：`0`
   * @since 2.5.0
   * @from wechat
   */
  skew?: number

  /** 展示 3D 楼块
   * 默认值：`false`
   * @since 2.3.0
   * @from wechat
   */
  enable3D?: boolean

  /** 显示指南针
   * 默认值：`false`
   * @since 2.3.0
   * @absence alipay
   */
  showCompass?: boolean

  /** 显示比例尺
   * 默认值：`false`
   * @since 2.8.0
   */
  showScale?: boolean

  /** 开启俯视
   * 默认值：`false`
   * @since 2.3.0
   * @absence alipay
   */
  enableOverlooking?: boolean

  /** 是否支持缩放
   * 默认值：`true`
   * @since 2.3.0
   * @absence alipay
   */
  enableZoom?: boolean

  /** 是否支持拖动
   * 默认值：`true`
   * @since 2.3.0
   * @absence alipay
   */
  enableScroll?: boolean

  /** 是否支持旋转
   * 默认值：`false`
   * @since 2.3.0
   * @absence alipay
   */
  enableRotate?: boolean

  /** 是否开启卫星图
   * 默认值：`false`
   * @since 2.7.0
   * @from wechat
   */
  enableSatellite?: boolean

  /** 是否开启实时路况
   * 默认值：`false`
   * @since 2.7.0
   * @from wechat
   */
  enableTraffic?: boolean

  /** 配置项
   * @since 2.8.2
   * @absence baidu
   */
  setting?: MapProps | { [key: string]: number | string | any }

  /** 点击地图时触发
   */
  onTap?: CommonEventFunction

  /** 点击标记点时触发，会返回 marker 的 id
   */
  onMarkerTap?: CommonEventFunction

  /** 点击控件时触发，会返回 control 的 id
   */
  onControlTap?: CommonEventFunction

  /** 点击标记点对应的气泡时触发，会返回 marker 的 id
   * @since 1.2.0
   */
  onCalloutTap?: CommonEventFunction

  /** 在地图渲染更新完成时触发
   * @since 1.6.0
   * @absence alipay
   */
  onUpdated?: CommonEventFunction

  /** 视野发生变化时触发
   * @since 2.3.0
   */
  onRegionChange?: CommonEventFunction

  /** 点击地图 poi 点时触发，会返回 poi 点的 name, longitude, latitude
   * @since 2.3.0
   * @absence alipay
   */
  onPoiTap?: CommonEventFunction

  /** 视野在地图 padding 范围内展示
   * @from alipay
   */
  includePadding?: { [key in ('left' | 'right' | 'top' | 'bottom')]: number | string }

  /** 覆盖物，自定义贴图
   * @from alipay
   */
  groundOverlays?: any[]

  /** 覆盖物，网格贴图
   * @from alipay
   */
  tileOverlay?: any[]

  /** 开启 optimize 模式后，无需再监听 onRegionChange 来获取并设置新的 scale 值以保证地图不会再回到原来的缩放比例。
   * @from alipay
   */
  optimize?: boolean
}

/** 地图
 * @classification maps
 */
declare const Map: ComponentType<MapProps>

export { Map, MapProps }
