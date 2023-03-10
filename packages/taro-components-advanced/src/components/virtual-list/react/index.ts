/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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
