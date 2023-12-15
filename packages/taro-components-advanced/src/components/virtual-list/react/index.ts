import { ScrollView, View } from '@tarojs/components'
import React from 'react'

import List from './list'
import outerWrapper from './wrapper'

import type { VirtualListProps } from '../'
import type { IProps } from '../preset'

const VirtualList = React.forwardRef(function VirtualList (props: VirtualListProps, ref) {
  const {
    direction = 'ltr',
    outerElementType = ScrollView,
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
    outerElementType,
    itemElementType,
    innerElementType,
    direction,
    initialScrollOffset,
    overscanCount,
    outerWrapper,
  })
})

export default VirtualList
