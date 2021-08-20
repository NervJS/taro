/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React from 'react'
import FixedSizeList from './FixedSizeList'
import { ScrollView, View } from '@tarojs/components'

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
  (props, ref) => {
    const { style, onScroll, onScrollNative, layout, ...rest } = props
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

const VirtualList = React.forwardRef((props, ref) => {
  const {
    direction = 'ltr',
    innerElementType = View,
    itemElementType = View,
    initialScrollOffset = 0,
    overscanCount = 1,
    ...rest
  } = props

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
