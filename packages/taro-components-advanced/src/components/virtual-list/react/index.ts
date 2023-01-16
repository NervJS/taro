import { ScrollView, View } from '@tarojs/components'
import React from 'react'

import { convertPX2Int } from '../../../utils/convert'
import List from './list'

import type { BaseEventOrig } from '@tarojs/components'
import type { VirtualListProps } from '../'
import type { IProps } from '../preset'

const OuterScrollView = React.forwardRef(
  function OuterScrollView (props, ref) {
    const { style, onScroll, onScrollNative, layout, ...rest } = props as IProps
    const handleScroll = (event: BaseEventOrig<VirtualListProps.IVirtualListEventDetail>) => {
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
      style,
      scrollY: layout === 'vertical',
      scrollX: layout === 'horizontal',
      onScroll: handleScroll,
      ...rest
    })
  }
)

const VirtualList = React.forwardRef(function VirtualList (props: VirtualListProps, ref) {
  const {
    direction = 'ltr',
    innerElementType = View,
    itemElementType = View,
    initialScrollOffset = 0,
    overscanCount = 1,
    ...rest
  } = props as IProps

  if ('children' in rest) {
    console.warn('Taro(VirtualList): children props have been deprecated. ' + 'Please use the item props instead.')
    rest.item = rest.children as IProps['item']
  }
  if (rest.item instanceof Array) {
    console.warn('Taro(VirtualList): item should not be an array')
    rest.item = rest.item[0]
  }
  return React.createElement(List, {
    ref,
    ...rest,
    itemElementType,
    innerElementType,
    outerElementType: OuterScrollView,
    direction,
    initialScrollOffset,
    overscanCount
  })
})

export default VirtualList
