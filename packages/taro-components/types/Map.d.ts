import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface MapProps extends StandardProps {
  /** 中心经度
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  longitude: number
  /** 中心纬度
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  latitude: number
  /** 缩放级别，取值范围为 3-20
   * @default 16
   * @supported weapp, alipay, swan, tt, qq, jd
   * @swan 取值范围为4-21
   * @alipay 取值范围为5-18
   */
  scale?: number
  /** 最小缩放级别 3-20
   * @default 3
   * @supported weapp, tt
   */
  minScale?: number
  /** 最大缩放级别 3-20
   * @default 20
   * @supported weapp, tt
   */
  maxScale?: number
  /** 标记点
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  markers?: MapProps.marker[]
  /** **即将移除，请使用 markers**
   * @supported weapp
   * @deprecated
   */
  covers?: any[]
  /** 路线
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  polyline?: MapProps.polyline[]
  /** 圆
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  circles?: MapProps.circle[]
  /** 控件（即将废弃，建议使用 cover-view 代替）
   * @deprecated
   * @supported weapp, alipay, swan, jd
   */
  controls?: MapProps.control[]
  /** 缩放视野以包含所有给定的坐标点
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  includePoints?: MapProps.point[]
  /** 显示带有方向的当前定位点
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  showLocation?: boolean
  /** 多边形
   * @supported weapp, swan, tt, qq
   */
  polygons?: MapProps.polygon[]
  /** 个性化地图使用的 key
   * @supported weapp, qq
   */
  subkey?: string
  /** 个性化地图配置的 style，不支持动态修改
   * @default 1
   * @supported weapp, qq
   */
  layerStyle?: number
  /** 旋转角度，范围 0 ~ 360, 地图正北和设备 y 轴角度的夹角
   * @default 0
   * @supported weapp, alipay, tt, qq
   */
  rotate?: number
  /** 倾斜角度，范围 0 ~ 40 , 关于 z 轴的倾角
   * @default 0
   * @supported weapp, alipay, tt, qq
   */
  skew?: number
  /** 显示指南针
   * @default false
   * @supported weapp, alipay, swan, tt, qq
   */
  showCompass?: boolean
  /** 显示比例尺
   * @default false
   * @supported weapp, alipay, tt, qq
   */
  showScale?: boolean
  /** 开启俯视
   * @default false
   * @supported weapp, alipay, swan, tt, qq
   */
  enableOverlooking?: boolean
  /** 是否支持缩放
   * @default true
   * @supported weapp, alipay, swan, tt, qq
   */
  enableZoom?: boolean
  /** 是否支持拖动
   * @default true
   * @supported weapp, alipay, swan, tt, qq
   */
  enableScroll?: boolean
  /** 是否支持旋转
   * @default false
   * @supported weapp, alipay, swan, tt, qq
   */
  enableRotate?: boolean
  /** 是否开启卫星图
   * @default false
   * @supported weapp, alipay, tt, qq
   */
  enableSatellite?: boolean
  /** 是否开启实时路况
   * @default false
   * @supported weapp, alipay, tt, qq
   */
  enableTraffic?: boolean
  /** 配置项
   *
   * 提供 setting 对象统一设置地图配置。同时对于一些动画属性如 rotate 和 skew，通过 setData 分开设置时无法同时生效，需通过 settting 统一修改。
   * @supported weapp, alipay, qq
   */
  setting?:
    | MapProps
    | {
        [key: string]: number | string | any
      }
  /** 视野在地图 padding 范围内展示
   * @supported alipay
   */
  includePadding?: { [key in 'left' | 'right' | 'top' | 'bottom']: number | string }
  /** 覆盖物，自定义贴图
   * @supported alipay
   */
  groundOverlays?: MapProps.groundOverlays[]
  /** 覆盖物，网格贴图
   * @supported alipay
   */
  tileOverlay?: MapProps.tileOverlay
  /** 是否展示 POI 点
   * @supported weapp, alipay, tt
   * @default true
   */
  enablePoi?: boolean
  /** 是否展示建筑物
   * @supported weapp, alipay, tt
   * @default true
   */
  enableBuilding?: boolean
  /** 覆盖物，多边形。
   * @supported alipay
   */
  polygon?: MapProps.polygon[]
  /** 设置地图样式。
   *
   * default：默认样式
   * light：精简样式
   * @supported alipay
   */
  customMapStyle?: string
  /** 基于 map 高级定制渲染，设置覆盖在地图上的 view。
   * @supported alipay
   */
  panels?: MapProps.panels[]
  /** 否
   * @supported jd
   */
  theme?: string
  /** 保持缩放比例不变
   * @supported alipay
   * @default false
   */
  optimize?: boolean
  /** 开启最大俯视角，俯视角度从 45 度拓展到 75 度
   * @supported weapp
   * @default false
   */
  enableAutoMaxOverlooking?: boolean
  /** 展示3D楼块
   * @supported weapp, swan, tt, qq
   * @default false
   */
  enable3D?: boolean
  /** 点击地图时触发
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  onTap?: CommonEventFunction
  /** 点击标记点时触发，e.detail = {markerId}
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  onMarkerTap?: CommonEventFunction<MapProps.onMarkerTapEventDetail>
  /** 点击label时触发，e.detail = {markerId}
   * @supported weapp, tt
   */
  onLabelTap?: CommonEventFunction<MapProps.onLabelTapEventDetail>
  /** 点击控件时触发，e.detail = {controlId}
   * @supported weapp, alipay, swan, jd
   */
  onControlTap?: CommonEventFunction<MapProps.onControlTapEventDetail>
  /** 点击标记点对应的气泡时触发，e.detail = {markerId}
   * @supported alipay
   */
  onCalloutTap?: CommonEventFunction<MapProps.onCalloutTapEventDetail>
  /** 在地图渲染更新完成时触发
   * @supported weapp, swan, tt, qq
   */
  onUpdated?: CommonEventFunction
  /** 视野发生变化时触发
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  onRegionChange?: CommonEventFunction<MapProps.onRegionEventDetail<'begin'> | MapProps.onRegionEventDetail<'end'>>
  /** 点击地图poi点时触发，e.detail = {name, longitude, latitude}
   * @supported weapp, swan, qq
   */
  onPoiTap?: CommonEventFunction<MapProps.onPoiTapEventDetail>
  /** 点击标记点对应的气泡时触发e.detail = {markerId}
   * @supported weapp, swan, tt, jd
   */
  onCallOutTap?: CommonEventFunction<MapProps.onCalloutTapEventDetail>
  /** 点击定位标时触发，e.detail = {longitude, latitude}
   * @supported weapp, tt
   */
  onAnchorPointTap?: CommonEventFunction<MapProps.point>
  /** 点击 panel 时触发。
   * @supported alipay
   */
  onPanelTap?: CommonEventFunction<{
    panelId
    layoutId
  }>
  /** 地图初始化完成即将开始渲染第一帧时触发。
   * @supported alipay
   */
  onInitComplete?: CommonEventFunction
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
    /** 标记点上方的气泡窗口
     * @remarks 支持的属性见下表，可识别换行符。
     */
    callout?: callout
    /** 自定义气泡窗口
     * @remarks 支持的属性见下表，可识别换行符。
     */
    customCallout?: customCallout
    /** 为标记点旁边增加标签
     * @remarks 支持的属性见下表
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
    /** 横向偏移量，向右为正数 */
    anchorX: number
    /** 纵向偏移量，向下为正数 */
    anchorY: number
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
  /** marker 上的自定义气泡 customCallout
   *
   * `customCallout` 存在时将忽略 `callout` 与 `title` 属性。自定义气泡采用采用 `cover-view` 定制，灵活度更高。
   */
  interface customCallout {
    /** 'BYCLICK':点击显示; 'ALWAYS':常显 */
    display: 'BYCLICK' | 'ALWAYS' | string
    /** 横向偏移量，向右为正数 */
    anchorX: number
    /** 纵向偏移量，向下为正数 */
    anchorY: number
  }
  /** marker 上的气泡 label */
  interface label {
    /** 文本 */
    content: string
    /** 文本颜色 */
    color: string
    /** 文字大小 */
    fontSize: number
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
    /**
     * 边线虚线
     * @remarks 默认值 [0, 0] 为实线，[10, 10]表示十个像素的实线和十个像素的空白（如此反复）组成的虚线
     * @default [0,0]
     * @supported weapp
     */
    dashArray?: number[]
    /** 经纬度数组
     * @remarks [{latitude: 0, longitude: 0}]
     */
    points: point[]
    /**
     * 线的颜色，用 8 位十六进制表示，后两位表示 alpha 值，如：#eeeeeeAA。
     * @remarks 当前 Android 与 iOS 上此属性默认值存在差异（分别为 transparent 与 #ff0000ff ），建议在代码中统一显式设置。
     * @supported alipay
     */
    color?: string
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
    /**
     * 线的宽度
     * @remarks 当前 Android 与 iOS 上此属性默认值存在差异（分别为 0 与 5），建议在代码中统一显式设置。
     * @supported alipay
     */
    width?: number
    /** 设置多边形Z轴数值 */
    zIndex?: number
    /**
     * 压盖关系
     * @supported weapp
     * @remarks 默认为 abovelabels
     */
    level?: string
    /**
     * 标明在特定地图缩放级别下展示。
     * @remarks [{ from: 12, to: 17}]
     * @supported alipay
     */
    displayRanges?: [
      {
        from: number
        to: number
      }
    ]
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
    position: position
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
  interface groundOverlays {
    /**刷新的时候需要变更id值 */
    id: string
    /**右上 左下 */
    'include-points': [
      {
        latitude: number
        longitude: number
      },
      {
        latitude: number
        longitude: number
      }
    ]
    image: string
    alpha: number
    zIndex: number
  }
  interface tileOverlay {
    url: string
    type: number
    tileWidth: number
    tileHeight: number
    zIndex: number
  }
  interface panels {
    id: number
    layout: {
      src: string
    }
    position: position
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
  namespace RegionChangeDetail {
    interface type {
      begin
      end
    }
    interface CausedByBegin {
      /** 手势触发 */
      gesture
      /** 接口触发 */
      update
    }
    interface CausedByEnd {
      /** 拖动导致 */
      drag
      /** 缩放导致 */
      scale
      /** 调用更新接口导致 */
      update
    }
  }
  interface onRegionEventDetail<T = keyof RegionChangeDetail.type> {
    /** 视野变化开始、结束时触发
     * @remarks 视野变化开始为begin，结束为end
     */
    type: T
    /** 导致视野变化的原因
     * @remarks 有效值为 gesture（手势触发）、update（接口触发或调用更新接口导致）、drag（拖动导致）、scale（缩放导致）
     */
    causedBy: keyof (T extends 'begin' ? RegionChangeDetail.CausedByBegin : RegionChangeDetail.CausedByEnd)
    /** 视野改变详情 */
    detail: regionChangeDetail<RegionChangeDetail.type>
  }
  interface regionChangeDetail<T = keyof RegionChangeDetail.type> {
    /** 旋转角度 */
    rotate: number
    /** 倾斜角度 */
    skew: number
    causedBy: keyof (T extends 'begin' ? RegionChangeDetail.CausedByBegin : RegionChangeDetail.CausedByEnd)
    type: T | string
    scale: number
    centerLocation: point
    region: {
      northeast: point
      southeast: point
    }
  }
  interface onPoiTapEventDetail {
    name: string
    longitude: number
    latitude: number
  }
  interface onPolylineTapEventDetail {
    polylineId: number
    longitude: number
    latitude: number
  }
  interface onAbilityEventDetail {
    ability: string
    errCode: number
    errMsg: string
  }
  interface onInterpolatePointEventDetail {
    markerId: number
    longitude: number
    latitude: number
    animationStatus: 'interpolating' | 'complete'
  }
}
/** 地图。相关api Taro.createMapContext。
 * @classification maps
 * @supported weapp, alipay, swan, tt, qq, jd
 * @example_react
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
 * @example_vue
 * ```html
 * <template>
 *   <map
 *     id="map"
 *     style="width: 100%; height: 300px;"
 *     longitude="113.324520"
 *     latitude="23.099994"
 *     scale="14"
 *     :markers="markers"
 *     :polyline="polyline"
 *     :show-location="true"
 *     `@regionchange="regionchange"
 *     `@markertap="markertap"
 *   />
 * </template>
 *
 * <script>
 * export default {
 *   data() {
 *     return {
 *       markers: [{
 *         iconPath: "https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4",
 *         id: 0,
 *         latitude: 23.099994,
 *         longitude: 113.324520,
 *         width: 50,
 *         height: 50
 *       }],
 *       polyline: [{
 *         points: [{
 *           longitude: 113.3245211,
 *           latitude: 23.10229
 *         }, {
 *           longitude: 113.324520,
 *           latitude: 23.21229
 *         }],
 *         color:"#FF0000DD",
 *         width: 2,
 *         dottedLine: true
 *       }]
 *     }
 *   },
 *   methods: {
 *     regionchange(e) {
 *       console.log(e.type)
 *     },
 *     markertap(e) {
 *       console.log("markertap:", e.detail.markerId)
 *     }
 *   }
 * }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map
 */
declare const Map: ComponentType<MapProps>
export { Map, MapProps }
