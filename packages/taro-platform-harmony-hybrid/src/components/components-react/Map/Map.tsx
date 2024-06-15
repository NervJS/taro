import React from 'react'

import sameLayerRender, { clearJsObj } from '../SameLayerRender'

interface marker {
  latitude: number
  longitude: number
  title?: string
  zIndex?: number // 图标所在层级
  iconPath?: string // 图标路径，当前仅支持base64图片
  rotate?: number // 图标旋转角度
  alpha?: number // 图标透明度，取值范围为0-1
  width?: number // 图标宽度
  height?: number // 图标高度
  anchor?: {
    x: number // 锚点X坐标，范围0-1
    y: number // 锚点Y坐标，范围0-1
  }
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  latitude: number
  longitude: number
  scale?: number // 缩放级别，取值范围为 3-20, 默认为16，鸿蒙取值范围是2-20
  rotate?: number // 旋转角度
  skew?: number // 倾斜角度
  minScale?: number // 最小缩放级别 3-20，鸿蒙取值范围是2-20, 对应minZoom
  maxScale?: number // 最大缩放级别 3-20，鸿蒙取值范围是2-20, 对应maxZoom
  enableZoom?: boolean // 是否支持缩放手势
  enableScroll?: boolean // 是否支持拖动手势
  enableRotate?: boolean // 是否支持旋转手势
  showCompass?: boolean // 显示指南针
  showScale?: boolean // 显示比例尺
  showLocation?: boolean // 显示当前定位点
  enableTraffic?: boolean // 是否显示路况图层
  markers?: marker[] // 标记点
  onTap?: (e: any) => void // 点击地图时触发
  onMarkerTap?: (e: any) => void // 点击marker时触发
  onCalloutTap?: (e: any) => void // 点击气泡时触发
  onUpdated?: (e: any) => void // 地图加载完成时触发
  onRegionChange?: (e: any) => void // 视野发生变化时触发
  onPoiTap?: (e: any) => void // 点击poi时触发
  onPolylineTap?: (e: any) => void // 点击折线时触发
  onError?: (e: any) => void // 地图加载失败时触发
  onAnchorPointTap?: (e: any) => void // 点击定位按钮时触发
}

class HosMap extends React.Component<IProps> {
  private componentId: string
  private nativeRenderArgs: object
  constructor (props: IProps) {
    super(props)
    this.componentId = `HosMap_${Math.floor(Math.random() * 100000)}_${Date.now()}`
    const {
      latitude,
      longitude,
      scale,
      rotate,
      skew,
      minScale,
      maxScale,
      enableZoom,
      enableScroll,
      enableRotate,
      showCompass,
      showScale,
      showLocation,
      enableTraffic,
      markers,
      onTap,
      onMarkerTap,
      onCalloutTap,
      onUpdated,
      onRegionChange,
      onPoiTap,
      onPolylineTap,
      onError,
      onAnchorPointTap,
    } = this.props
    this.nativeRenderArgs = {
      componentId: this.componentId,
      latitude,
      longitude,
      zoom: scale,
      bearing: rotate,
      tilt: skew,
      minZoom: minScale,
      maxZoom: maxScale,
      zoomGesturesEnabled: enableZoom,
      scrollGesturesEnabled: enableScroll,
      rotateGesturesEnabled: enableRotate,
      compassControlsEnabled: showCompass,
      scaleControlsEnabled: showScale,
      setMyLocationEnabled: showLocation,
      setTrafficEnabled: enableTraffic,
      markers,
      onMapClick: onTap,
      onMarkerClick: onMarkerTap,
      onBubbleClick: onCalloutTap,
      onMapLoad: onUpdated,
      onCameraChange: onRegionChange,
      onPoiClick: onPoiTap,
      onPolylineClick: onPolylineTap,
      onError: onError,
      onMyLocationButtonClick: onAnchorPointTap,
    }
    sameLayerRender.transferSameLayerArgs(this.nativeRenderArgs)
  }

  componentWillUnmount (): void {
    // 释放JS侧存储的渲染参数
    clearJsObj(this.nativeRenderArgs)
  }

  render (): React.ReactNode {
    const { style, className, id } = this.props
    return (
      <div className={className} style={style} id={id}>
        <embed
          style={{ width: '100%', height: '100%', objectPosition: 'inherit', display: 'block' }}
          id={this.componentId}
          type="native/hos-map" />
      </div>
    )
  }
}

export default HosMap