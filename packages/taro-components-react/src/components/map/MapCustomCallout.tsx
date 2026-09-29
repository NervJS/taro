import { View } from '@tarojs/components'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import type MapTypes from 'tmap-gl-types'

interface MapCustomCalloutProps {
  map: MapTypes.Map | null
  markerId: number
  position: {
    lat: number
    lng: number
  }
  anchorX: number
  anchorY: number
  display?: 'ALWAYS' | 'BYCLICK'
  children: React.ReactNode
  onCalloutTap?: (markerId: number) => void
}

const MapCustomCallout: React.FC<MapCustomCalloutProps> = memo(({
  map,
  markerId,
  position,
  anchorX,
  anchorY,
  display = 'ALWAYS',
  children,
  onCalloutTap,
}) => {
  const calloutRef = useRef<HTMLDivElement>(null)
  const [visible] = useState(display === 'ALWAYS')

  /**
   * 更新气泡位置
   */
  const updatePosition = useCallback(() => {
    if (!map || !calloutRef.current) return

    try {
      const latLng = new TMap.LatLng(position.lat, position.lng)
      const containerPoint = map.projectToContainer(latLng)

      if (!containerPoint) return

      const x = containerPoint.x + anchorX
      const y = containerPoint.y + anchorY

      // 直接设置 style
      calloutRef.current.style.position = 'absolute'
      calloutRef.current.style.left = '0px'
      calloutRef.current.style.top = '0px'
      calloutRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`
      calloutRef.current.style.pointerEvents = 'auto'
      calloutRef.current.style.zIndex = '1000'
      calloutRef.current.style.cursor = 'pointer'
    } catch {
      // 忽略位置更新错误
    }
  }, [map, position, anchorX, anchorY])

  /**
   * 处理 touchend 事件
   * 对齐小程序默认行为：点击气泡任意位置都触发 onCalloutTap
   * 子元素可以通过 stopPropagation() 阻止事件冒泡，只处理自己的 onClick
   */
  const handleTouchEnd = useCallback((e: any) => {
    const target = e?.target
    if (!target) return

    // 派发 click 事件，让子元素自己的 onClick 处理
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
    target.dispatchEvent(clickEvent)

    // 对齐小程序默认行为：点击气泡任意位置都触发 onCalloutTap
    onCalloutTap?.(markerId)
  }, [markerId, onCalloutTap])

  /**
   * 监听地图变化,实现自动跟随
   */
  useEffect(() => {
    if (!map || !visible) return

    const events = ['bounds_changed', 'zoom_changed', 'drag', 'rotate'] as const
    events.forEach(event => map.on(event, updatePosition))

    requestAnimationFrame(() => {
      updatePosition()
    })

    return () => {
      events.forEach(event => map.off(event, updatePosition))
    }
  }, [map, updatePosition, visible])

  if (!visible) return null

  return (
    <View
      ref={calloutRef}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        pointerEvents: 'auto',
        zIndex: 1000,
        cursor: 'pointer',
      }}
    >
      {children}
    </View>
  )
})

MapCustomCallout.displayName = 'MapCustomCallout'

export default MapCustomCallout
