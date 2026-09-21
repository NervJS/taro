/* eslint-disable no-console */
import React, { Children, useEffect, useMemo, useRef, useState } from 'react'
import { MultiCircle, MultiMarker, MultiPolygon, MultiPolyline, TMap } from 'tlbs-map-react'

import { createForwardRefComponent } from '../../utils'
import { logPrefix } from './common'
import { registerMapInstance, unregisterMapInstance } from './MapContext'
import MapCustomCallout from './MapCustomCallout'

import type { MapProps as TaroMapProps } from '@tarojs/components'
import type MapTypes from 'tmap-gl-types'

export interface MapProps extends Omit<TaroMapProps, 'onError'> {
  forwardedRef?: React.MutableRefObject<any>
  authKey?: string
  libraries?: string
  onError?: (e: any) => void
}

const DEFAULT_OVERLAY_BORDER_COLOR = '#3777FF'
const DEFAULT_OVERLAY_FILL = 'rgba(55, 119, 255, 0.2)'

function Map (props: MapProps) {
  const {
    forwardedRef,
    id,
    className,
    style,
    authKey,
    libraries,
    longitude,
    latitude,
    scale,
    minScale,
    maxScale,
    enableRotate,
    rotate,
    skew,
    markers,
    polyline,
    circles,
    polygons,
    showCompass,
    showScale,
    enableOverlooking,
    enableZoom,
    enableScroll,
    enableSatellite,
    enableTraffic,
    enableBuilding,
    enableAutoMaxOverlooking,
    enable3D,
    onTap,
    onMarkerTap,
    onUpdated,
    onRegionChange,
    onAuthSuccess,
    onError,
  } = props
  // eslint-disable-next-line no-console
  console.log(logPrefix, 'props', props)

  /** ************************处理 style********************** */
  const styleObj = typeof style === 'string' || style === undefined ? {} : (style as Record<string, string>)

  /** ************************处理 marker********************** */
  const normalizedMarkers = markers ?? []
  const markerStyles: Record<string, any> = {}
  const markerGeometries: any[] = []
  // 保留 marker.id 原始类型（onMarkerTapEventDetail.markerId: number|string），
  // 点击事件按几何 id 回查原始值，避免数字字符串 id 被强制改型。
  // 前置约束：marker.id 须全局唯一（与微信一致）；字符串 id "1" 与缺 id 的 index 1 会碰撞，业务侧需避免
  const markerIdLookup: Record<string, number | string> = {}

  normalizedMarkers.forEach((m, index) => {
    const markerId = String(m.id ?? index)
    const styleId = `marker-${markerId}`
    markerIdLookup[markerId] = m.id ?? index

    // Taro: iconPath (string)；tlbs-map-react: styles 中指定图标
    // Taro: width, height (number|string)；tlbs-map-react: width, height
    // Taro: rotate (number)；tlbs-map-react: rotation
    // Taro: alpha (number 0-1)；tlbs-map-react: opacity (0-1)
    // Taro: zIndex (number)；tlbs-map-react: zIndex

    // 解析宽高，支持数字和字符串（如 '20px'）
    const parseSize = (size: number | string | undefined): number => {
      if (typeof size === 'number') return size
      if (typeof size === 'string') {
        const parsed = parseInt(size, 10)
        return isNaN(parsed) ? 20 : parsed
      }
      return 20 // 默认宽度
    }

    const markerWidth = parseSize(m.width)
    const markerHeight = parseSize(m.height)

    // 宽高为 0 时跳过渲染（隐藏 marker，仅保留气泡）
    if (markerWidth === 0 || markerHeight === 0) {
      return
    }

    markerStyles[styleId] = {
      width: markerWidth,
      height: markerHeight,
      anchor: { x: markerWidth / 2, y: markerHeight }, // 默认底部中心为锚点
      ...(m.iconPath && { src: m.iconPath }),
      ...(typeof m.rotate === 'number' && { rotation: m.rotate }),
      ...(typeof m.alpha === 'number' && { opacity: m.alpha }),
      ...(typeof m.zIndex === 'number' && { zIndex: m.zIndex }),
    }

    markerGeometries.push({
      id: markerId,
      styleId,
      position: { lat: m.latitude, lng: m.longitude },
    })
  })

  /** ************************处理 polyline********************** */
  const normalizedPolylines = polyline ?? []
  const polylineStyles: Record<string, any> = {}
  const polylineGeometries: any[] = []

  normalizedPolylines.forEach((line, lineIndex) => {
    if (!line.points || line.points.length === 0) return

    const styleId = `polyline-${lineIndex}`

    // Taro: color (hex)；腾讯地图: color
    // Taro: width (number)；腾讯地图: width
    // Taro: dottedLine (boolean)；腾讯地图: dashArray ([10,10]虚线, [0,0]实线)
    polylineStyles[styleId] = {
      color: line.color || DEFAULT_OVERLAY_BORDER_COLOR,
      width: Math.round(line.width ?? 3), // 取整，tlbs-map-react 要求 width 为整数
      // 虚线：[10, 10] 表示10像素实线 + 10像素空白；实线：[0, 0]
      dashArray: line.dottedLine ? [10, 10] : [0, 0],
    }

    // Taro: points 是 {latitude, longitude}[] 数组
    // tlbs-map-react: geometries 需要路径点数组
    polylineGeometries.push({
      id: String(lineIndex),
      styleId,
      paths: line.points.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      })),
    })
  })

  /** ************************处理 circle********************** */
  const normalizedCircles = circles ?? []
  const circleStyles: Record<string, any> = {}
  const circleGeometries: any[] = []

  normalizedCircles.forEach((c, index) => {
    if (typeof c.latitude !== 'number' || typeof c.longitude !== 'number') return
    if (typeof c.radius !== 'number' || c.radius <= 0) return

    const styleId = `circle-${index}`

    // Taro: color 描边色；fillColor 填充色；strokeWidth 描边宽；radius 米
    // 腾讯 CircleStyle 继承 PolygonStyle: color 填充 + borderColor/borderWidth/showBorder
    circleStyles[styleId] = {
      color: c.fillColor || DEFAULT_OVERLAY_FILL,
      showBorder: true,
      borderColor: c.color || DEFAULT_OVERLAY_BORDER_COLOR,
      borderWidth: Math.max(0, Math.round(c.strokeWidth ?? 2)),
    }

    circleGeometries.push({
      id: String(index),
      styleId,
      center: { lat: c.latitude, lng: c.longitude },
      radius: c.radius,
    })
  })

  /** ************************处理 polygon********************** */
  const normalizedPolygons = polygons ?? []
  const polygonStyles: Record<string, any> = {}
  const polygonGeometries: any[] = []

  normalizedPolygons.forEach((p, index) => {
    if (!p.points || p.points.length === 0) return

    const styleId = `polygon-${index}`

    // Taro polygon: color=填充，strokeColor=边线，strokeWidth=边线宽，dashArray=边线虚线
    polygonStyles[styleId] = {
      color: p.fillColor || DEFAULT_OVERLAY_FILL,
      showBorder: true,
      borderColor: p.strokeColor || DEFAULT_OVERLAY_BORDER_COLOR,
      borderWidth: Math.max(0, Math.round(p.strokeWidth ?? 2)),
      borderDashArray: p.dashArray ?? [0, 0],
    }

    polygonGeometries.push({
      id: String(index),
      styleId,
      paths: p.points.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      })),
    })
  })

  /** ************************处理 baseMap (satellite / traffic / building / 3D)********************** */
  // TMap 的 useEffect([baseMap]) 按对象引用比较；baseMap 若 inline 构造，每次 render 都是新引用，
  // 会重复触发 setBaseMap（底层样式重建），故用 useMemo 固定引用
  const mergedBaseMap = useMemo(() => {
    const base: any[] = []
    // 仅在显式传 enable3D/enableBuilding 时才列 features 做约束；全不传时回退 {type:'vector'}
    // （腾讯规则：features 非数组=全部地物显示），与改动前行为逐字节一致，避免存量 3D 楼块消失。
    // 注意：这与 Taro enable3D 默认 false 的语义存在偏差（未传时 3D 楼块维持腾讯默认显示），
    // 属刻意的零破坏决策，与 viewMode 条件透传同原则
    if (typeof enable3D === 'boolean' || typeof enableBuilding === 'boolean') {
      const vectorFeatures: string[] = ['base', 'point', 'label', 'arrow']
      // 未显式传的维度维持腾讯默认（显示）；仅显式 false 才剔除
      if (enable3D !== false) {
        vectorFeatures.push('building3d')
      }
      if (enableBuilding !== false) {
        vectorFeatures.push('building2d')
      }
      base.push({ type: 'vector', features: vectorFeatures })
    } else {
      base.push({ type: 'vector' })
    }

    if (enableSatellite) {
      base.push({ type: 'satellite', features: ['base'] })
    }
    if (enableTraffic) {
      base.push({ type: 'traffic' })
    }
    return base
  }, [enable3D, enableBuilding, enableSatellite, enableTraffic])

  /** ************************处理 control (compass / scale / zoom)********************** */
  // 修正：control 也是对象，必须 useMemo，否则 TMap 每次 render 反复 add/removeControl
  // setMapControl 机制：control 里"缺的 key"会被 removeControl，存在即保留（空配置 = 沿用腾讯默认位置，视觉与存量逐像素一致）
  const mergedControl = useMemo(() => {
    const control: Record<string, { position?: string }> = {
      zoom: {}, // Taro 无 zoom 控件开关，恒保留存量 H5 的 +/- 按钮
    }
    // showScale/showCompass 与 viewMode/enable3D/pitchable 同一原则：条件透传零破坏。
    // 未传或 true → 维持存量默认显示；仅显式 false 才从 control 中剔除（被 removeControl 隐藏）。
    // 与 Taro 默认值(false)存在刻意偏差：Taro 语义在"显式传参"时生效，默认行为保 H5 存量
    if (showScale !== false) {
      control.scale = {}
    }
    if (showCompass !== false) {
      // 腾讯没有字面 compass，rotation 控件即罗盘样式，语义等价
      control.rotation = {}
    }
    return control
  }, [showScale, showCompass])

  /** ************************适配 options 参数********************** */
  const hasCenter = typeof latitude === 'number' && typeof longitude === 'number'
  // 命名陷阱：腾讯 MapOptions.scale 是"地图显示比例"(默认 1)，Taro scale 是"缩放级别"
  // Taro scale → 腾讯 zoom，防止误接
  const mergedOptions = {
    ...(hasCenter ? { center: { lat: latitude, lng: longitude } } : {}),
    zoom: scale ?? 13,
    minZoom: minScale ?? 3,
    maxZoom: maxScale ?? 20,
    rotatable: enableRotate ?? false, // Taro: enableRotate；tlbs-map-react: options.rotatable
    ...(typeof rotate === 'number' && { rotation: rotate }), // Taro: rotate；tlbs-map-react: options.rotation
    ...(typeof skew === 'number' && { pitch: skew }), // Taro: skew；tlbs-map-react: options.pitch
    draggable: enableScroll !== false, // Taro: enableScroll(默认 true)；腾讯: draggable
    scrollable: enableZoom !== false, // 滚轮缩放
    doubleClickZoom: enableZoom !== false, // 双击缩放
    // enableOverlooking → pitchable 条件透传：未传时维持 TMap 默认 true（3D 模式下可右键俯仰），
    // 与 viewMode/enable3D 同原则，避免存量 H5 页面失去既有的俯仰能力
    ...(typeof enableOverlooking === 'boolean' && { pitchable: enableOverlooking }),
    ...(typeof enable3D === 'boolean' && { viewMode: (enable3D ? '3D' : '2D') as '3D' | '2D' }),
    // showControl 恒 true（false 会移除含 zoom 在内的全部内置控件），
    // 具体的 scale/rotation 显隐由下方 control 对象按需控制
    showControl: true,
    baseMap: mergedBaseMap,
  }

  /**
   * 事件回调统一经 ref 读取：tlbs-map-react 的 useEventListener 只在图层实例创建时绑定一次回调，
   * 直接传 inline handler 会捕获首帧 props 形成过期闭包（onTap 原有模式沿用了这个坑），此处阻断
   */
  const runtimeRef = useRef({ onTap, onMarkerTap, onUpdated, onRegionChange, markerIdLookup })
  useEffect(() => {
    runtimeRef.current = { onTap, onMarkerTap, onUpdated, onRegionChange, markerIdLookup }
  })

  /** ************************事件工厂********************** */
  const buildTaroEvent = (type: string, detail: Record<string, any> = {}): any => ({
    type,
    timeStamp: Date.now(),
    target: {
      id: id || '',
      tagName: 'map',
      dataset: {},
    },
    currentTarget: {
      id: id || '',
      tagName: 'map',
      dataset: {},
    },
    detail,
    preventDefault: () => {},
    stopPropagation: () => {},
  })

  // Taro: onTap；腾讯地图: click
  // 腾讯事件返回: MapEvent { latLng: LatLng, point: {x, y}, type, target, originalEvent }
  const handleMapClick = (e: MapTypes.MapEvent) => {
    console.log(logPrefix, 'source click e:', e)
    const cb = runtimeRef.current.onTap
    if (typeof cb === 'function') {
      cb(buildTaroEvent(e.type, {
        latitude: e.latLng.lat,
        longitude: e.latLng.lng,
      }))
    }
  }

  // MultiMarker 通过 useEventListener 把 onClick 绑到图层实例上，e.geometry 是被点击的 marker
  const handleMarkerClick = (e: any) => {
    const cb = runtimeRef.current.onMarkerTap
    if (typeof cb !== 'function') return
    const geometry = e?.geometry
    if (geometry?.id === undefined) return
    // 按几何 id 回查原始 marker.id，保留调用方传入的类型（number|string）
    const markerId = runtimeRef.current.markerIdLookup[String(geometry.id)] ?? geometry.id
    cb(buildTaroEvent('markertap', { markerId }))
  }

  // 存储地图实例,用于 H5 端自定义气泡
  const [mapInstance, setMapInstance] = useState<MapTypes.Map | null>(null)

  // 地图初始化成功
  const handleMapInited = (instance: MapTypes.Map) => {
    console.log(logPrefix, '地图初始化成功', instance)
    setMapInstance(instance)

    // 注册地图实例到全局存储
    if (id) {
      registerMapInstance(id, instance)
      console.log(logPrefix, '已注册地图实例到 MapContext, id:', id)
    }

    let settled = false
    instance.on('tilesloaded', (_res) => { /** 瓦片加载完成,地图真正可用 */
      // Taro onUpdated = "地图渲染更新完成时触发"，与鉴权 settled 状态无关，每次 tilesloaded 都发
      // 已知语义缺口：视野内拖动但不加载新瓦片时不会触发，属近似实现（腾讯无等价"渲染更新"事件）
      const cb = runtimeRef.current.onUpdated
      if (typeof cb === 'function') {
        cb(buildTaroEvent('updated'))
      }
      // TODO: 临时先这么简单处理鉴权成功
      if (!settled && typeof onAuthSuccess === 'function') {
        settled = true
        onAuthSuccess({
          type: 'authsuccess',
          timeStamp: Date.now(),
          target: {
            id: id || '',
            tagName: 'map',
            dataset: {},
          },
          currentTarget: {
            id: id || '',
            tagName: 'map',
            dataset: {},
          },
          detail: {
            errCode: 0,
            errMsg: 'ok',
          },
          preventDefault: () => {},
          stopPropagation: () => {},
        })
      }
    })
    setTimeout(() => {
      if (!settled && typeof onError === 'function') {
        settled = true
        onError({
          type: 'error',
          timeStamp: Date.now(),
          target: {
            id: id || '',
            tagName: 'map',
            dataset: {},
          },
          currentTarget: {
            id: id || '',
            tagName: 'map',
            dataset: {},
          },
          detail: {
            errCode: 1001,
            errMsg: 'timeout',
          },
          preventDefault: () => {},
          stopPropagation: () => {},
        })
      }
    }, 3000)
  }

  // 组件卸载时清理地图实例
  useEffect(() => {
    return () => {
      if (id) {
        unregisterMapInstance(id)
        console.log(logPrefix, '已注销地图实例, id:', id)
      }
    }
  }, [id])

  /** *********** 命令式补 tlbs-map-react 漏传的 GL option（修正 1） *********** */
  // tlbs-map-react 只解构固定 options 字段，touchZoomable 会被静默丢弃，
  // 必须对 mapInstance 命令式调用 setter 才能让 enableZoom 卡住 pinch 手势
  useEffect(() => {
    if (!mapInstance) return
    mapInstance.setTouchZoomable(enableZoom !== false)
  }, [mapInstance, enableZoom])

  // Taro enableAutoMaxOverlooking 语义: false->45°，true->75°（非腾讯默认 80°）
  useEffect(() => {
    if (!mapInstance) return
    if (typeof enableAutoMaxOverlooking !== 'boolean') return
    mapInstance.setMaxPitch(enableAutoMaxOverlooking ? 75 : 45)
  }, [mapInstance, enableAutoMaxOverlooking])

  /** *********** onRegionChange 适配：腾讯 movestart/moveend *********** */
  const beginZoomRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mapInstance) return

    // 视野快照：scale/rotate/skew/centerLocation/region，与 Taro regionChangeDetail 对齐
    const collectSnapshot = () => {
      const center = mapInstance.getCenter()
      const bounds = mapInstance.getBounds()
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()
      return {
        scale: mapInstance.getZoom(),
        rotate: mapInstance.getRotation(),
        skew: mapInstance.getPitch(),
        centerLocation: { latitude: center.lat, longitude: center.lng },
        region: {
          northeast: { latitude: ne.lat, longitude: ne.lng },
          // Taro spec 字段名为 southeast；腾讯边界只有 ne/sw，用 sw 纬度 + ne 经度拼出东南角
          southeast: { latitude: sw.lat, longitude: ne.lng },
        },
      }
    }

    const handleMoveStart = () => {
      const cb = runtimeRef.current.onRegionChange
      if (typeof cb !== 'function') return
      // 已知边界：父组件改 scale/latitude 等 prop 时，TMap 内部 panTo/zoomTo 同样触发 movestart，
      // 此处 causedBy 会误报 gesture（微信语义应为 update）——腾讯事件源不区分手势/接口触发，无可靠判据
      beginZoomRef.current = mapInstance.getZoom()
      const snap = collectSnapshot()
      cb(buildTaroEvent('regionchange', {
        type: 'begin',
        causedBy: 'gesture',
        ...snap,
        // Taro d.ts 在 detail 内还嵌套一层 detail 子对象（与微信运行时扁平结构不一致），两种形状都发
        detail: { type: 'begin', causedBy: 'gesture', ...snap },
      }))
    }

    const handleMoveEnd = () => {
      const cb = runtimeRef.current.onRegionChange
      if (typeof cb !== 'function') return
      // end 阶段 causedBy 合法值: drag|scale|update；按手势期间 zoom 是否变化区分 drag/scale
      // 注：纯旋转/纯俯仰手势没有对应合法值，按 drag 上报（微信 end 阶段 causedBy 无 rotate 类）
      const beginZoom = beginZoomRef.current
      const causedBy = beginZoom !== null && beginZoom !== mapInstance.getZoom() ? 'scale' : 'drag'
      beginZoomRef.current = null
      const snap = collectSnapshot()
      cb(buildTaroEvent('regionchange', {
        type: 'end',
        causedBy,
        ...snap,
        detail: { type: 'end', causedBy, ...snap },
      }))
    }

    // movestart/moveend 事件名取自腾讯 GL 文档（本地 tmap-gl-types 无事件名佐证）；
    // 即便名称不存在仅监听不生效，不会抛错，属安全降级
    mapInstance.on('movestart', handleMoveStart)
    mapInstance.on('moveend', handleMoveEnd)

    return () => {
      // 注意：tlbs-map-react 的 useEventListener 卸载时误用了 on（其 bug），
      // 此处用 off 主动清理，避免组件重挂载时监听器累加
      mapInstance.off('movestart', handleMoveStart)
      mapInstance.off('moveend', handleMoveEnd)
    }
  }, [mapInstance])

  return (
    <TMap
      id={id}
      ref={forwardedRef}
      className={className}
      style={styleObj}
      apiKey={authKey ?? ''}
      libraries={libraries}
      options={mergedOptions}
      control={mergedControl}
      onClick={handleMapClick}
      onMapInited={handleMapInited}
    >
      {normalizedMarkers.length > 0 ? (
        <MultiMarker
          id="taro-markers"
          styles={markerStyles}
          geometries={markerGeometries}
          onClick={handleMarkerClick}
        />
      ) : null}
      {polylineGeometries.length > 0 ? (
        <MultiPolyline id="taro-polylines" styles={polylineStyles} geometries={polylineGeometries} />
      ) : null}
      {circleGeometries.length > 0 ? (
        // MultiCircle 的 d.ts 误把 prop 声明成 gemeitries，运行时实际读取 geometries（经 index signature 放行）
        <MultiCircle id="taro-circles" styles={circleStyles} geometries={circleGeometries} />
      ) : null}
      {polygonGeometries.length > 0 ? (
        <MultiPolygon id="taro-polygons" styles={polygonStyles} geometries={polygonGeometries} />
      ) : null}

      {/* H5 端:自动处理 slot="callout" 的 CoverView */}
      {process.env.TARO_ENV === 'h5' ? renderH5CustomCallouts() : props.children}
    </TMap>
  )

  /**
   * H5 端渲染自定义气泡
   * 拦截 slot="callout" 的 CoverView,转换为自定义 Overlay
   */
  function renderH5CustomCallouts() {
    if (!mapInstance) return null

    // 1. 遍历 props.children,找到 slot="callout" 的 CoverView
    const childrenArray = Children.toArray(props.children)
    const calloutSlot = childrenArray.find((child: any) =>
      React.isValidElement(child) && (child.props as { slot?: string })?.slot === 'callout'
    ) as React.ReactElement<{ children?: React.ReactNode }> | undefined

    if (!calloutSlot || !React.isValidElement(calloutSlot)) {
      return null
    }

    // 2. 遍历内层的 CoverView,提取 markerId 和内容
    const innerCoverViews = Children.toArray(calloutSlot.props.children)

    return innerCoverViews.map((child: any) => {
      if (!React.isValidElement(child)) return null

      const childProps = child.props as { markerId?: number, children?: React.ReactNode }
      const markerId = childProps.markerId
      if (!markerId) return null

      // 3. 找到对应的 marker 信息
      const marker = normalizedMarkers.find((m: any) => m.id === markerId)
      if (!marker) {
        console.warn(logPrefix, `未找到 markerId=${markerId} 对应的 marker`)
        return null
      }

      // 4. 渲染自定义气泡
      return (
        <MapCustomCallout
          key={markerId}
          map={mapInstance}
          markerId={markerId}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          anchorX={marker.customCallout?.anchorX ?? 0}
          anchorY={marker.customCallout?.anchorY ?? 0}
          display={marker.customCallout?.display === 'BYCLICK' ? 'BYCLICK' : 'ALWAYS'}
          onCalloutTap={(id) => {
            // 触发 onCalloutTap 事件
            if (typeof props.onCalloutTap === 'function') {
              props.onCalloutTap({
                type: 'callouttap',
                timeStamp: Date.now(),
                target: {
                  id: String(id) || '',
                  tagName: 'callout',
                  dataset: {},
                },
                currentTarget: {
                  id: String(id) || '',
                  tagName: 'callout',
                  dataset: {},
                },
                detail: { markerId: id },
                preventDefault: () => {},
                stopPropagation: () => {},
              })
            }
          }}
        >
          {childProps.children}
        </MapCustomCallout>
      )
    })
  }
}

export default createForwardRefComponent(Map)

/**
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
 */
export { createMapContext } from './createMapContext'
