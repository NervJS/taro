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
}

class _Text extends React.Component<Props> {
  props: Props

  render () {
    const {
      style,
      children,
      selectable,
    } = this.props

    return (
      <Text
        selectable={!!selectable}
        style={style}
      >
        {children}
      </Text>
    )
  }
}

export default _Text
