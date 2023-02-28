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
