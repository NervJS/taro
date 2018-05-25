/**
 * ✔ checked
 * ✔ type
 * ✔ bindchange :isChecked
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
import Checkbox from '../checkbox'

type Props = {
  style?: StyleSheet.Styles,
  checked?: boolean,
  type?: 'switch' | 'checkbox',
  bindchange?: Function,
  color?: string
}

class _Switch extends Component<Props> {
  props: Props

  static defaultProps = {
    type: 'switch',
    color: '#2BA245'
  }

  onCheckboxToggle = (item) => {
    const { bindchange } = this.props
    bindchange && bindchange(item.checked)
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
      return (
        <Checkbox
          bindchange={onCheckboxToggle}
          checked={checked}
        />
      )
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
