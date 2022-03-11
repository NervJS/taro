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

const _Text: React.FC<TextProps> = ({
  style,
  children,
  selectable,
  onClick,
  ...otherProps
}: TextProps) => {
  return (
    <Text
      textBreakStrategy='simple'
      numberOfLines={0}
      style={[{ fontFamily: '' }, style]}
      selectable={!!selectable}
      onPress={onClick}
      {...otherProps}
    >
      {children}
    </Text>
  )
}

_Text.displayName = '_Text'

export default _Text
