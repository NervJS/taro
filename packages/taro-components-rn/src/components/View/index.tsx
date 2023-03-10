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
  Text,
} from 'react-native'
import { extracteTextStyle, omit } from '../../utils'
import ClickableSimplified, { clickableHandlers } from '../ClickableSimplified'
import { _ViewProps } from './PropsType'

const stringToText = (child: any, props: any) => {
  // TODO: 实现小程序中效果
  return (typeof child === 'string' || typeof child === 'number')
    ? <Text {...omit(props, clickableHandlers)}>{child}</Text> : child
}

const _View: React.ForwardRefExoticComponent<_ViewProps & React.RefAttributes<any>> = React.forwardRef((props: _ViewProps, ref: React.ForwardedRef<any>) => {
  const textStyle = extracteTextStyle(props.style)
  // 兼容View中没用Text包裹的文字 防止报错 直接继承props在安卓中文字会消失？？？
  const child = Array.isArray(props.children) ? props.children.map((c: any, i: number) => stringToText(c, { key: i, ...props, style: textStyle })) : stringToText(props.children, { ...props, style: textStyle })
  return (
    <View
      ref={ref}
      style={props.style}
      {...props}
    >
      {child}
    </View>
  )
})

_View.displayName = '_View'

export { _View }
export default ClickableSimplified(_View)
