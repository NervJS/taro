/**
 * @see .android.js
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  Image,
  StyleSheet,
} from 'react-native'
import * as WEUI from '../../assets/weui'

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

  const imageAsset = iconObj.image
  // @todo Back & Delete do not have default color. '#B2B2B2'
  const iconColor = color || iconObj.defaultColor

  return (
    <View style={[style, { width: size, height: size }]}>
      <Image
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
