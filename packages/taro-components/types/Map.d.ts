import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface MapProps extends StandardProps {
  /** 中心经度
   * @supported weapp, swan, alipay
   */
  longitude: number

  /** 中心纬度
   * @supported weapp, swan, alipay
   */
  latitude: number

  /** 缩放级别，取值范围为3-20
   * @default 16
   * @supported weapp, swan, alipay
   * @swan 取值范围为4-21
   * @alipay 取值范围为5-18
   */
  scale?: number

  /** 标记点
   * @supported weapp, swan, alipay
   */
  markers?: MapProps.marker[]

  /** 标记点
   * @deprecated 即将移除，请使用 markers
   * @supported weapp
   */
  covers?: any[]

  /** 路线
   * @supported weapp, swan, alipay
   */
  polyline?: MapProps.polyline[]

  /** 圆
   * @supported weapp, swan, alipay
   */
  circles?: MapProps.circle[]

  /** 控件（即将废弃，建议使用 cover-view 代替）
   * @deprecated
   * @supported weapp, swan, alipay
   */
  controls?: MapProps.control[]

  /** 缩放视野以包含所有给定的坐标点
   * @supported weapp, swan, alipay
   */
  includePoints?: MapProps.point[]

  /** 显示带有方向的当前定位点
   * @default false
   * @supported weapp, swan, alipay
   */
  showLocation?: boolean

  /** 多边形
   * @supported weapp, swan, alipay
   */
  polygons?: MapProps.polygon[]

  /** 个性化地图使用的 key
   * @supported weapp
   */
  subkey?: string

  /** 个性化地图配置的 style，不支持动态修改
   * @default 1
   * @supported weapp
   */
  layerStyle?: number

  /** 旋转角度，范围 0 ~ 360, 地图正北和设备 y 轴角度的夹角
   * @default 0
   * @supported weapp
   */
  rotate?: number

  /** 倾斜角度，范围 0 ~ 40 , 关于 z 轴的倾角
   * @default 0
   * @supported weapp
   */
  skew?: number

  /** 展示 3D 楼块
   * @default false
   * @supported weapp, swan
   */
  enable3D?: boolean

  /** 显示指南针
   * @default false
   * @supported weapp, swan
   */
  showCompass?: boolean

  /** 显示比例尺
   * @default false
   * @supported weapp
   */
  showScale?: boolean

  /** 开启俯视
   * @default false
   * @supported weapp, swan
   */
  enableOverlooking?: boolean

  /** 是否支持缩放
   * @default true
   * @supported weapp, swan
   */
  enableZoom?: boolean

  /** 是否支持拖动
   * @default true
   * @supported weapp, swan
   */
  enableScroll?: boolean

  /** 是否支持旋转
   * @default false
   * @supported weapp, swan
   */
  enableRotate?: boolean

  /** 是否开启卫星图
   * @default false
   * @supported weapp
   */
  enableSatellite?: boolean

  /** 是否开启实时路况
   * @default false
   * @supported weapp
   */
  enableTraffic?: boolean

  /** 配置项
   * 
   * 提供 setting 对象统一设置地图配置。同时对于一些动画属性如 rotate 和 skew，通过 setData 分开设置时无法同时生效，需通过 settting 统一修改。
   * @supported weapp, alipay
   */
  setting?: MapProps | { [key: string]: number | string | any }

  /** 点击地图时触发
   * @supported weapp, swan, alipay
   */
  onTap?: CommonEventFunction

  /** 点击标记点时触发，e.detail = {markerId}
   * @supported weapp, swan, alipay
   */
  onMarkerTap?: CommonEventFunction<MapProps.onMarkerTapEventDetail>

  /** 点击label时触发，e.detail = {markerId}
   * @supported weapp
   */
  onLabelTap?: CommonEventFunction<MapProps.onLabelTapEventDetail>

  /** 点击控件时触发，e.detail = {controlId}
   * @supported weapp, swan, alipay
   */
  onControlTap?: CommonEventFunction<MapProps.onControlTapEventDetail>

  /** 点击标记点对应的气泡时触发，e.detail = {markerId}
   * @supported weapp, swan, alipay
   */
  onCalloutTap?: CommonEventFunction<MapProps.onCalloutTapEventDetail>

  /** 在地图渲染更新完成时触发
   * @supported weapp, swan
   */
  onUpdated?: CommonEventFunction

  /** 视野发生变化时触发
   * @supported weapp, swan, alipay
   */
  onRegionChange?: CommonEventFunction<MapProps.onRegionChangeEventDetail>

  /** 点击地图poi点时触发，e.detail = {name, longitude, latitude}
   * @supported weapp, swan
   */
  onPoiTap?: CommonEventFunction<MapProps.onPoiTapEventDetail>

  /** 视野在地图 padding 范围内展示
   * @supported alipay
   */
  includePadding?: { [key in ('left' | 'right' | 'top' | 'bottom')]: number | string }

  /** 覆盖物，自定义贴图
   * @supported alipay
   */
  groundOverlays?: any[]

  /** 覆盖物，网格贴图
   * @supported alipay
   */
  tileOverlay?: any[]

  /** 开启 optimize 模式后，无需再监听 onRegionChange 来获取并设置新的 scale 值以保证地图不会再回到原来的缩放比例。
   * @supported alipay
   */
  optimize?: boolean
}

declare namespace MapProps {
  /** 标记点用于在地图上显示标记的位置 */
  interface marker {
    /** 标记点id
     * @remarks marker 点击事件回调会返回此id。建议为每个 marker 设置上 Number 类型 id，保证更新 marker 时有更好的性能。
     */
    id?: number
    /** 纬度
     * @remarks 浮点数，范围 -90 ~ 90
     */
    latitude: number
    /** 经度
     * @remarks 浮点数，范围 -180 ~ 180
     */
    longitude: number
    /** 标注点名
     * @remarks 点击时显示，callout 存在时将被忽略
     */
    title?: string
    /** 显示层级
     */
    zIndex?: number
    /** 显示的图标
     * @remarks 项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径和网络图片
     */
    iconPath: string
    /** 旋转角度
     * @remarks 顺时针旋转的角度，范围 0 ~ 360，默认为 0
     */
    rotate?: number
    /** 标注的透明度
     * @remarks 默认1，无透明，范围 0 ~ 1
     */
    alpha?: number
    /** 标注图标宽度
     * @remarks 默认为图片实际宽度
     */
    width?: number | string
    /** 标注图标高度
     * @remarks 默认为图片实际高度
     */
    height?: number | string
    /** 自定义标记点上方的气泡窗口
     * @remarks 支持的属性见下表，可识别换行符。
     */
    callout?: callout
    /** 为标记点旁边增加标签
     * @remarks 支持的属性见下表，可识别换行符。
     */
    label?: label
    /** 经纬度在标注图标的锚点，默认底边中点
     * @remarks {x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点
     */
    anchor?: {
      x: number
      y: number
    }
    /** 无障碍访问，（属性）元素的额外描述 */
    ariaLabel?: string
  }

  /** marker 上的气泡 callout */
  interface callout {
    /** 文本 */
    content: string
    /** 文本颜色 */
    color: string
    /** 文字大小 */
    fontSize: number
    /** 边框圆角 */
    borderRadius: number
    /** 边框宽度 */
    borderWidth: number
    /** 边框颜色 */
    borderColor: string
    /** 背景色 */
    bgColor: string
    /** 文本边缘留白 */
    padding: number
    /** 'BYCLICK':点击显示; 'ALWAYS':常显 */
    display: 'BYCLICK' | 'ALWAYS'
    /** 文本对齐方式。有效值: left, right, center */
    textAlign: 'left' | 'right' | 'center'
  }

  /** marker 上的气泡 label */
  interface label {
    /** 文本 */
    content: string
    /** 文本颜色 */
    color: string
    /** 文字大小 */
    fontSize: number
    /** label的坐标（废弃）
     * @deprecated
     */
    x: number
    /** label的坐标（废弃）
     * @deprecated
     */
    y: number
    /** label的坐标，原点是 marker 对应的经纬度 */
    anchorX: number
    /** label的坐标，原点是 marker 对应的经纬度 */
    anchorY: number
    /** 边框宽度 */
    borderWidth: number
    /** 边框颜色 */
    borderColor: string
    /** 边框圆角 */
    borderRadius: number
    /** 背景色 */
    bgColor: string
    /** 文本边缘留白 */
    padding: number
    /** 文本对齐方式。有效值: left, right, center */
    textAlign: 'left' | 'right' | 'center'
  }

  /** 指定一系列坐标点，从数组第一项连线至最后一项 */
  interface polyline {
    /** 经纬度数组
     * @remarks [{latitude: 0, longitude: 0}]
     */
    points: point[]
    /** 线的颜色
     * @remarks 十六进制
     */
    color?: string
    /** 线的宽度 */
    width?: number
    /** 是否虚线
     * @remarks 默认 false
     */
    dottedLine?: boolean
    /** 带箭头的线
     * @remarks 默认 false，开发者工具暂不支持该属性
     */
    arrowLine?: boolean
    /** 更换箭头图标
     * @remarks 在 arrowLine 为 true 时生效
     */
    arrowIconPath?: string
    /** 线的边框颜色 */
    borderColor?: string
    /** 线的厚度 */
    borderWidth?: number
  }

  /** 指定一系列坐标点，根据 points 坐标数据生成闭合多边形 */
  interface polygon {
    /** 经纬度数组
     * @remarks [{latitude: 0, longitude: 0}]
     */
    points: point[]
    /** 描边的宽度 */
    strokeWidth?: number
    /** 描边的颜色
     * @remarks 十六进制
     */
    strokeColor?: string
    /** 填充颜色
     * @remarks 十六进制
     */
    fillColor?: string
    /** 设置多边形Z轴数值 */
    zIndex?: number
  }

  /** 在地图上显示圆 */
  interface circle {
    /** 纬度
     * @remarks 浮点数，范围 -90 ~ 90
     */
    latitude: number
    /** 经度
     * @remarks 浮点数，范围 -180 ~ 180
     */
    longitude?: number
    /** 描边的颜色
     * @remarks 十六进制
     */
    color?: string
    /** 填充颜色
     * @remarks 十六进制
     */
    fillColor?: string
    /** 半径 */
    radius: number
    /** 描边的宽度 */
    strokeWidth?: number
  }

  /** 在地图上显示控件，控件不随着地图移动。即将废弃，请使用 cover-view
   * @deprecated
   */
  interface control {
    /** 控件id
     * @remarks 在控件点击事件回调会返回此id
     */
    id?: number
    /** 控件在地图的位置
     * @remarks 控件相对地图位置
     */
    position: point
    /** 显示的图标
     * @remarks 项目目录下的图片路径，支持本地路径、代码包路径
     */
    iconPath: string
    /** 是否可点击
     * @remarks 默认不可点击
     */
    clickable?: boolean
  }

  interface point {
    /** 经度 */
    longitude: number
    /** 纬度 */
    latitude: number
  }

  interface position {
    /** 距离地图的左边界多远
     * @default 0
     */
    left: number
    /** 距离地图的上边界多远
     * @default 0
     */
    top: number
    /** 控件宽度
     * @default 图片宽度
     */
    width: number
    /** 控件高度
     * @default 图片宽度
     */
    height: number
  }

  interface onMarkerTapEventDetail {
    markerId: number | string
  }
  interface onLabelTapEventDetail {
    markerId: number | string
  }
  interface onControlTapEventDetail {
    controlId: number | string
  }
  interface onCalloutTapEventDetail {
    markerId: number | string
  }
  interface onRegionChangeEventDetail {
    /** 视野变化开始、结束时触发
     * @remarks 视野变化开始为begin，结束为end
     */
    type: 'begin' | 'end' | string
    /** 导致视野变化的原因
     * @remarks 拖动地图导致(drag)、缩放导致(scale)、调用接口导致(update)
     */
    causedBy: 'drag' | 'scale' | 'update' | string
    /** 视野改变详情 */
    detail: regionChangeDetail
  }
  interface regionChangeDetail {
    /** 旋转角度 */
    rotate: number
    /** 倾斜角度 */
    skew: number
  }
  interface onPoiTapEventDetail {
    name: string
    longitude: number
    latitude: number
  }
}

/** 地图。相关api Taro.createMapContext。
 * @classification maps
 * @supported weapp, alipay, swan
 * @example
 * ```tsx
 * class App extends Component {
 *   onTap () {}
 *   render () {
 *     return (
 *       <Map onClick={this.onTap} />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map
 */
declare const Map: ComponentType<MapProps>

export { Map, MapProps }
