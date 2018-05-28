/**
 * @flow
 */

import React, { Component } from 'react'
import {
  TouchableWithoutFeedback
} from 'react-native'

type Props = {
  onClick?: Function
}

export default function (WrappedComponent) {
  return class extends Component<Props> {
    render () {
      return (
        <TouchableWithoutFeedback onPress={this.props.onClick}>
          <WrappedComponent {...this.props} />
        </TouchableWithoutFeedback>
      )
    }
  }
}
