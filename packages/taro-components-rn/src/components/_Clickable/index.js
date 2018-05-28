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
      // const flattenStyle = StyleSheet.flatten(this.props.style)
      // const newStyle = flattenStyle
      const dismember = dismemberStyle(this.props.style)

      return (
        <TouchableWithoutFeedback onPress={this.props.onClick}>
          <View style={dismember.wrapperStyle}>
            <WrappedComponent {...this.props} style={dismember.innerStyle} />
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
}
