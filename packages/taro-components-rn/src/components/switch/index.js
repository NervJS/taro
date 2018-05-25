/**
 * ✔ checked
 * ✘ type
 * ✔ bindchange
 * ✔ color
 *
 * @see https://wechat.design/brand/color
 *
 * @flow
 */

import React, { Component } from 'react'
import {
  Switch,
  StyleSheet,
} from 'react-native'

type Props = {
  style?: StyleSheet.Styles,
  checked?: boolean,
  type?: 'switch' | 'checkbox',
  bindchange?: Function,
  color?: string
}

class _Switch extends Component<Props> {
  static defaultProps = {
    type: 'switch',
    color: '#2BA245'
  }

  render () {
    const {
      style,
      checked,
      type,
      bindchange,
      color
    } = this.props

    if (type === 'checkbox') {
      // @todo use checkbox component
      // return
    }

    return (
      <Switch
        value={checked}
        onValueChange={bindchange}
        onTintColor={color}
        style={[style, { width: size, height: size }]}
      />
    )
  }
}

export default _Switch
