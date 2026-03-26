/* eslint-disable no-console */
import React, { Children, useEffect, useState } from 'react'
import { MultiMarker, MultiPolyline, TMap } from 'tlbs-map-react'

import { createForwardRefComponent } from '../../utils'
import { logPrefix } from './common'
import { registerMapInstance, unregisterMapInstance } from './MapContext'
import MapCustomCallout from './MapCustomCallout'

import type { MapProps as TaroMapProps } from '@tarojs/components'
import type MapTypes from 'tmap-gl-types'

export interface MapProps extends Omit<TaroMapProps, 'onError'> {
  forwardedRef?: React.MutableRefObject<any>
  authKey?: string
  onError?: (e: any) => void
}

function Map (props: MapProps) {
  const {
    forwardedRef,
    id,
    className,
    style,
    authKey,
    longitude,
    latitude,
    scale,
    minScale,
    maxScale,
    enableRotate,
    markers,
    polyline,
    onTap,
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

  normalizedMarkers.forEach((m, index) => {
    const markerId = String(m.id ?? index)
    const styleId = `marker-${markerId}`

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
      color: line.color || '#3777FF',
      width: line.width ?? 3,
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

  /** ************************适配options参数********************** */
  const hasCenter = typeof latitude === 'number' && typeof longitude === 'number'
  const mergedOptions = {
    ...(hasCenter ? { center: { lat: latitude, lng: longitude } } : {}),
    zoom: scale ?? 13,
    minZoom: minScale ?? 3,
    maxZoom: maxScale ?? 20,
    rotatable: enableRotate ?? false, // Taro: enableRotate；tlbs-map-react: options.rotatable
  }

  /** ************************处理事件********************** */
  // Taro: onTap；腾讯地图: click
  // 腾讯地图事件返回: MapEvent { latLng: LatLng, point: {x, y}, type, target, originalEvent }
  // Taro 事件格式: BaseEventOrig { type, timeStamp, target, currentTarget, detail, ... }
  const handleMapClick = (e: MapTypes.MapEvent) => {
    console.log(logPrefix, 'source click e:', e)
    if (typeof onTap === 'function') {
      onTap({
        type: e.type,
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
          latitude: e.latLng.lat,
          longitude: e.latLng.lng,
        },
        preventDefault: () => {},
        stopPropagation: () => {},
      })
    }
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

  return (
    <TMap
      id={id}
      ref={forwardedRef}
      className={className}
      style={styleObj}
      apiKey={authKey ?? ''}
      options={mergedOptions}
      onClick={handleMapClick}
      onMapInited={handleMapInited}
    >
      {normalizedMarkers.length > 0 ? (
        <MultiMarker id="taro-markers" styles={markerStyles} geometries={markerGeometries} />
      ) : null}
      {polylineGeometries.length > 0 ? (
        <MultiPolyline id="taro-polylines" styles={polylineStyles} geometries={polylineGeometries} />
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
      React.isValidElement(child) && child.props?.slot === 'callout'
    )

    if (!calloutSlot || !React.isValidElement(calloutSlot)) {
      return null
    }

    // 2. 遍历内层的 CoverView,提取 markerId 和内容
    const innerCoverViews = Children.toArray(calloutSlot.props.children)

    return innerCoverViews.map((child: any) => {
      if (!React.isValidElement(child)) return null

      const markerId = child.props?.markerId
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
          display={marker.customCallout?.display ?? 'ALWAYS'}
          onCalloutTap={(id) => {
            // 触发 onCalloutTap 事件
            if (typeof props.onCalloutTap === 'function') {
              props.onCalloutTap({
                type: 'callouttap',
                timeStamp: Date.now(),
                target: {
                  id: id || '',
                  tagName: 'callout',
                  dataset: {},
                },
                currentTarget: {
                  id: id || '',
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
          {child.props.children}
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
