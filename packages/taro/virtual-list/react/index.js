import React from 'react'
import FixedSizeList from './FixedSizeList'
import { ScrollView, View } from '@tarojs/components'

const OuterScrollView = React.forwardRef(
  (props, ref) => {
    const { style, onScroll, ...rest } = props

    const handleScroll = event => {
      onScroll({
        ...event,
        currentTarget: {
          ...event.detail,
          clientWidth: style.width,
          clientHeight: style.height
        }
      })
    }

    return React.createElement(ScrollView, {
      ref,
      style,
      scrollY: style.direction === 'ltr',
      scrollX: style.direction !== 'ltr',
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
    itemHeight,
    layout = 'vertical',
    overscanCount = 1,
    ...rest
  } = props

  return React.createElement(FixedSizeList, {
    ref,
    ...rest,
    innerElementType,
    outerElementType: OuterScrollView,
    itemSize: itemHeight,
    direction,
    initialScrollOffset,
    layout,
    overscanCount
  })
})

export default VirtualList
