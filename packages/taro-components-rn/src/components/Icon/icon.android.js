/**
 * ✔ type
 * ✔ size
 * ✔ color
 *
 * @warn
 *  ~~iOS: Remember to link the libART.a into your project,~~
 *  ~~see more: https://stackoverflow.com/questions/37658957/no-component-found-for-view-with-name-artshape.~~
 *  现在 iOS 上用图片了
 *
 * @see https://github.com/react-native-china/react-native-ART-doc
 * @example <Icon type='success' color='green' />
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  ART,
  StyleSheet,
} from 'react-native'
import * as WEUI from '../../assets/weui'

const { Surface, Shape, Transform } = ART
const iconTypeMap: Object = {
  'success': 'SUCCESS',
  'success_no_circle': 'SUCCESS_NO_CIRCLE',
  'info': 'INFO',
  'warn': 'WARN',
  'waiting': 'WAITING',
  'cancel': 'CANCEL',
  'download': 'DOWNLOAD',
  'search': 'SEARCH',
  'clear': 'CLEAR',
}

type Props = {
  style?: StyleSheet.Styles,
  type: 'success' | 'success_no_circle' | 'info' | 'warn' | 'waiting' | 'cancel' | 'download' | 'search' | 'clear',
  size?: number | string,
  color?: string,
}

module.exports = function _Icon ({
  style,
  type,
  size = 23,
  color,
}: Props) {
  size = ~~size

  const iconObj = WEUI[iconTypeMap[type]]

  if (!iconObj) {
    return (
      <View style={[style, { width: size, height: size }]} />
    )
  }

  const iconPath = iconObj.path
  // @todo Back & Delete do not have default color. '#B2B2B2'
  const iconColor = color || iconObj.defaultColor

  const transform = new Transform().scale(size / WEUI.VIEWBOX_SIZE)

  return (
    <View style={[style, { width: size, height: size }]}>
      <View style={{
        transform: [{ rotateX: '180deg' }]
      }}>
        <Surface width={size} height={size}>
          <Shape
            d={iconPath}
            width={size}
            height={size}
            fill={iconColor}
            transform={transform} />
        </Surface>
      </View>
    </View>
  )
}
