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

const _Text: React.FC<TextProps> = React.forwardRef((props: TextProps, ref: React.ForwardedRef<any>) => {
  const {
    style,
    children,
    selectable,
    onClick,
    ...otherProps
  } = props

  return (
    <Text
      ref={ref}
      selectable={!!selectable}
      style={style}
      onPress={onClick}
      {...otherProps}
    >
      {children}
    </Text>
  )
})

_Text.displayName = '_Text'

export default _Text
