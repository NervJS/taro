import { ScrollView, View } from '@tarojs/components'
import React from 'react'

import Waterfall from './waterfall'
import outerWrapper from './wrapper'

import type { VirtualWaterfallProps } from '../'
import type { IProps } from '../preset'

const VirtualWaterfall = React.forwardRef(function VirtualWaterfall (props: VirtualWaterfallProps, ref) {
  const {
    outerElementType = ScrollView,
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
    outerWrapper,
  })
})

export default VirtualWaterfall
