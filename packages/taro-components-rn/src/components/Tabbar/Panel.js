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

class TabbarPanel extends React.Component<Props> {
  render () {
    const {
      children,
      style,
      ...reset
    } = this.props

    return (
      <View {...reset} style={[styles.panel, style]}>
        {children}
      </View>
    )
  }
}

export default TabbarPanel
