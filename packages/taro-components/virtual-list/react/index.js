import React from 'react'
import FixedSizeList from './FixedSizeList'
import { ScrollView, View } from '@tarojs/components'

const OuterScrollView = React.forwardRef(
  (props, ref) => {
    const { style, onScroll, onScrollNative, layout, ...rest } = props
    const handleScroll = event => {
      onScroll({
        ...event,
        currentTarget: {
          ...event.detail,
          clientWidth: style.width,
          clientHeight: style.height
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

const VirtualList = React.forwardRef((props, ref) => {
  const {
    direction = 'ltr',
    innerElementType = View,
    initialScrollOffset = 0,
    overscanCount = 1,
    ...rest
  } = props

  return React.createElement(FixedSizeList, {
    ref,
    ...rest,
    innerElementType,
    outerElementType: OuterScrollView,
    direction,
    initialScrollOffset,
    overscanCount
  })
})

export default VirtualList
