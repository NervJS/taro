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

import * as React from 'react'
import {
  View,
  Image
} from 'react-native'
import * as WEUI from '../../assets/weui'
import { IconProps } from './PropsType'

interface UIType {
  [key: string]: any;
}

const iconTypeMap: { [key: string]: string } = {
  success: 'SUCCESS',
  success_no_circle: 'SUCCESS_NO_CIRCLE',
  info: 'INFO',
  warn: 'WARN',
  waiting: 'WAITING',
  cancel: 'CANCEL',
  download: 'DOWNLOAD',
  search: 'SEARCH',
  clear: 'CLEAR',
}

const _Icon: React.FC<IconProps> = ({
  style,
  type,
  size = 23,
  color
}: IconProps) => {
  size = ~~size

  const iconObj: any = (WEUI as UIType)[iconTypeMap[type]]

  if (!iconObj) {
    return (
      <View style={[style, { width: size, height: size }]} />
    )
  }

  const imageAsset: any = iconObj.image
  // @todo Back & Delete do not have default color. '#B2B2B2'
  const iconColor: string = color || iconObj.defaultColor

  return (
    <View testID='icon' style={[style, { width: size, height: size }]}>
      <Image
        testID='image'
        source={imageAsset}
        style={{
          width: size,
          height: size,
          tintColor: iconColor
        }}
      />
    </View>
  )
}

_Icon.displayName = '_Icon'

export default _Icon
