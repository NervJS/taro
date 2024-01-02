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
  StyleProp,
  TextStyle,
} from 'react-native'
import { extracteTextStyle, omit } from '../../utils'
import { _ViewProps } from './PropsType'
import useClickable, { clickableHandlers } from '../hooks/useClickable'
import { ClickableProps } from '../hooks/PropsType'

const stringToText = (child: any, props: any) => {
  // TODO: 实现小程序中效果
  if (typeof child === 'string' || typeof child === 'number') {
    // textNode节点
    return <Text {...omit(props, clickableHandlers)}>{child}</Text>
  }
  return child
}

// 兼容View中没用Text包裹的文字 防止报错 直接继承props在安卓中文字会消失？？？
const renderChildren = (children: React.ReactNode, props: any) => {
  let textStyle: StyleProp<TextStyle> | null = null
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if ((typeof child === 'string' || typeof child === 'number') && !textStyle) {
      // 存在textNode，解析textStyle
        textStyle = extracteTextStyle(props.style)
      }
      return stringToText(child, { key: i, ...props, style: textStyle })
    })
  } else {
    if ((typeof children === 'string' || typeof children === 'number') && !textStyle) {
      // 存在textNode，解析textStyle
      textStyle = extracteTextStyle(props.style)
    }
    return stringToText(children, { ...props, style: textStyle })
  }
}

const _View: React.ForwardRefExoticComponent<_ViewProps & ClickableProps & React.RefAttributes<any>> = React.forwardRef((props: _ViewProps & ClickableProps, ref: React.ForwardedRef<any>) => {
  const clickable = useClickable(props) // 性能优化：从HOC替换成hooks，减少一层组件实例
  return (
    <View
      ref={ref}
      {...clickable}
    >
      {renderChildren(props.children, props)}
    </View>
  )
})

_View.displayName = '_View'

export { _View }
export default _View
