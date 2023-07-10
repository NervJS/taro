import { type BaseEventOrig, ScrollView, View } from '@tarojs/components'
import React from 'react'

import { convertPX2Int } from '../../../utils/convert'
import Waterfall from './waterfall'

import type { VirtualWaterfallProps } from '../'
import type { IProps } from '../preset'

const OuterScrollView = React.forwardRef(
  function OuterScrollView (props, ref) {
    const { id, className, style, onScroll, onScrollNative, ...rest } = props as IProps
    const handleScroll = (event: BaseEventOrig<VirtualWaterfallProps.IVirtualWaterfallEventDetail>) => {
      onScroll({
        ...event as any,
        currentTarget: {
          ...event.detail,
          clientWidth: convertPX2Int(style.width),
          clientHeight: convertPX2Int(style.height)
        } as any
      })

      if (typeof onScrollNative === 'function') {
        onScrollNative(event)
      }
    }

    return React.createElement<any>(ScrollView, {
      ref,
      id,
      className,
      style,
      scrollY: true,
      onScroll: handleScroll,
      ...rest
    })
  }
)

const VirtualWaterfall = React.forwardRef(function VirtualWaterfall (props: VirtualWaterfallProps, ref) {
  const {
    outerElementType = OuterScrollView,
    innerElementType = View,
    itemElementType = View,
    initialScrollOffset = 0,
    overscanDistance = 50,
    ...rest
  } = props as IProps

  if ('children' in rest) {
    console.warn('Taro(VirtualWaterfall): children props have been deprecated. ' + 'Please use the item props instead.')
    rest.item = rest.children as IProps['item']
  }
  if (rest.item instanceof Array) {
    console.warn('Taro(VirtualWaterfall): item should not be an array')
    rest.item = rest.item[0]
  }
  return React.createElement(Waterfall, {
    ref,
    ...rest,
    outerElementType,
    itemElementType,
    innerElementType,
    initialScrollOffset,
    overscanDistance,
  })
})

export default VirtualWaterfall
