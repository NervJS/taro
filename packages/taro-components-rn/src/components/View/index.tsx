/**
 * ✔ hoverStyle (hover-class)
 * ✘ hover-stop-propagation
 * ✔ hoverStartTime
 * ✔ hoverStayTime
 */

import * as React from 'react'
import {
  View,
  Text,
} from 'react-native'
import ClickableSimplified from '../ClickableSimplified'
import { _ViewProps } from './PropsType'

const stringToText = (child: any, props: any) => {
  // TODO: 实现小程序中效果
  return (typeof child === 'string' || typeof child === 'number') ? <Text {...props}>{child}</Text> : child
}

const _View: React.FC<_ViewProps> = (props: _ViewProps) => {
  // 兼容View中没用Text包裹的文字 防止报错 直接继承props在安卓中文字会消失？？？
  const child = Array.isArray(props.children) ? props.children.map((c: any, i: number) => stringToText(c, { key: i, ...props, style: {} })) : stringToText(props.children, { ...props, style: {} })
  return (
    <View
      style={props.style}
      {...props}
    >
      {child}
    </View>
  )
}

_View.displayName = '_View'

export { _View }
export default ClickableSimplified(_View)
