/**
 * ✔ selectable
 * ✘ space
 * ✘ decode: Fixed value TRUE
 *
 * @flow
 */

import * as React from 'react'
import {
  Text,
  StyleSheet,
} from 'react-native'

type Props = {
  style?: StyleSheet.Styles,
  children?: any,
  selectable?: boolean,
  onClick?: Function,
}

export default function _Text ({
  style,
  children,
  selectable,
  onClick,
}: Props) {
  return (
    <Text
      selectable={!!selectable}
      style={style}
      onPress={onClick}
    >
      {children}
    </Text>
  )
}
