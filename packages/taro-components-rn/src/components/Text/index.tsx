/**
 * ✔ selectable
 * ✘ space
 * ✘ decode: Fixed value TRUE
 */

import * as React from 'react'
import {
  Text
} from 'react-native'
import { TextProps } from './PropsType'

const _Text: React.SFC<TextProps> = ({
  style,
  children,
  selectable,
  onClick,
  ...otherProps
}) => {
  return (
    <Text
      selectable={!!selectable}
      style={style}
      onPress={onClick}
      {...otherProps}
    >
      {children}
    </Text>
  )
}

_Text.displayName = '_Text'

export default _Text
