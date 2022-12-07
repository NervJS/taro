import { ScrollView, View } from '@tarojs/components'
import React from 'react'

import FixedSizeList from './FixedSizeList'

function convertPxToInt (style) {
  if (typeof style === 'string') {
    const str = style.toLowerCase()
    if (/px$/.test(str)) {
      return Number(str.replace(/px$/, ''))
    }
  }
  return style
}

const OuterScrollView = React.forwardRef(
  function OuterScrollView (props, ref) {
    const { style, onScroll, onScrollNative, layout, ...rest } = props as any
    const handleScroll = event => {
      onScroll({
        ...event,
        currentTarget: {
          ...event.detail,
          clientWidth: convertPxToInt(style.width),
          clientHeight: convertPxToInt(style.height)
        }
      })

      if (typeof onScrollNative === 'function') {
        onScrollNative(event)
      }
    }

    return React.createElement(ScrollView, {
      ref,
      style,
      scrollY: layout === 'vertical',
      scrollX: layout === 'horizontal',
      onScroll: handleScroll,
      ...rest
    })
  }
)

const VirtualList = React.forwardRef(function VirtualList (props, ref) {
  const {
    direction = 'ltr',
    innerElementType = View,
    itemElementType = View,
    initialScrollOffset = 0,
    overscanCount = 1,
    ...rest
  } = props as any

  if (rest.children instanceof Array) {
    console.warn('Taro(VirtualList): children should not be an array')
    rest.children = rest.children[0]
  }
  return React.createElement(FixedSizeList, {
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
