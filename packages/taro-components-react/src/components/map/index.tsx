/* eslint-disable no-console */
import { MultiMarker, MultiPolyline, TMap } from 'tlbs-map-react'

import { createForwardRefComponent } from '../../utils'

import type { MapProps as TaroMapProps } from '@tarojs/components'
import type React from 'react'

export interface MapProps extends Omit<TaroMapProps, 'onError'> {
  forwardedRef?: React.MutableRefObject<any>
  authKey?: string
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
  } = props

  console.log('props', props)
  console.log('props.toString', JSON.stringify(props))


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

    // Taro: color (hex)；tlbs-map-react: strokeColor
    // Taro: width (number)；tlbs-map-react: strokeWidth
    // Taro: dottedLine (boolean)；tlbs-map-react: lineType (dashed/solid)
    polylineStyles[styleId] = {
      strokeColor: line.color || '#000000',
      strokeWidth: line.width || 4,
      lineType: line.dottedLine ? 'dashed' : 'solid',
    }

    // Taro: points 是 {latitude, longitude}[] 数组
    // tlbs-map-react: geometries 需要路径点数组
    polylineGeometries.push({
      id: String(line.id ?? lineIndex),
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
    rotatable: enableRotate ?? true, // Taro: enableRotate；tlbs-map-react: options.rotatable
  }

  return (
    <TMap
      id={id}
      ref={forwardedRef}
      className={className}
      style={styleObj}
      apiKey={authKey ?? ''}
      options={mergedOptions}
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
