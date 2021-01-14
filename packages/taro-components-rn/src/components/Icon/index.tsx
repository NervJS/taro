/**
 * ✔ type
 * ✔ size
 * ✔ color
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
  // eslint-disable-next-line @typescript-eslint/camelcase
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

_Icon.displayName = '_Icon'

export default _Icon
