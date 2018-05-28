/**
 * @flow
 */

import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback
} from 'react-native'

type Props = {
  children?: React.Node,
  onClick?: Function
}

class _Clickable extends Component<Props> {
  render () {
    return (
      <TouchableWithoutFeedback onPress={this.props.onClick}>
        <View>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Clickable
