/**
 * @flow
 */

import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import { dismemberStyle } from '../../utils'

type Props = {
  style?: StyleSheet.Styles,
  onClick?: Function
}

export default function (WrappedComponent: React.ComponentType<*>) {
  return class _Clickable extends React.Component<Props> {
    props: Props

    render () {
      const {
        style,
        onClick
      } = this.props

      if (!onClick) {
        return (
          <WrappedComponent {...this.props} />
        )
      }

      const dismember = dismemberStyle(style)

      return (
        <TouchableWithoutFeedback onPress={onClick}>
          <View style={dismember.wrapperStyle}>
            <WrappedComponent {...this.props} style={dismember.innerStyle} />
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
}
