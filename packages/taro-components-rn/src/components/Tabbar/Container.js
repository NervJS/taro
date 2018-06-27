/**
 * @flow
 */

import * as React from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import styles from './styles'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
}

class TabbarContainer extends React.Component<Props> {
  render () {
    const {
      children,
      style,
      ...reset
    } = this.props

    return (
      <View {...reset} style={[styles.container, style]}>
        {children}
      </View>
    )
  }
}

export default TabbarContainer
