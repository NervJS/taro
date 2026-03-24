/* eslint-disable no-console */
import { useEffect } from 'react'
import { MultiMarker, MultiPolyline, TMap } from 'tlbs-map-react'

import { createForwardRefComponent } from '../../utils'
import { logPrefix } from './common'
import { registerMapInstance, unregisterMapInstance } from './MapContext'

import type { MapProps as TaroMapProps } from '@tarojs/components'
import type React from 'react'
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

  console.log(logPrefix, 'props', props)
  console.log(logPrefix, 'props.toString', JSON.stringify(props))


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

  // 地图初始化成功
  const handleMapInited = (mapInstance: MapTypes.Map) => {
    console.log(logPrefix, '地图初始化成功', mapInstance)
    // 注册地图实例到全局存储
    if (id) {
      registerMapInstance(id, mapInstance)
      console.log(logPrefix, '已注册地图实例到 MapContext, id:', id)
    }

    let settled = false
    mapInstance.on('tilesloaded', (_res) => { /** 瓦片加载完成,地图真正可用 */
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
    </TMap>
  )
}

export default createForwardRefComponent(Map)

// TODO: createMapContext 临时从这里导出，后续需要调整
export { createMapContext } from './createMapContext'
