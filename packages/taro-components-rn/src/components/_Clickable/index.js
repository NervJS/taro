/**
 * @flow
 */

import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import { dismemberStyle } from '../../utils'

type Props = {
  onClick?: Function
}

export default function (WrappedComponent) {
  return class extends Component<Props> {
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
