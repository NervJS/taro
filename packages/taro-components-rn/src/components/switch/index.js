/**
 * ✔ checked
 * ✔ type
 * ✔ bindchange :isChecked
 * ✔ color
 *
 * @warn When type="switch", use native Switch
 * @see https://wechat.design/brand/color
 * @example
 *  <Switch
 *    checked={this.state.isSwitchChecked}
 *    bindchange={this.onSwitchChange}
 *    color="red"
 *  />
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
          bindchange={this.onCheckboxToggle}
          checked={checked}
        />
      )
    }

    return (
      <Switch
        value={checked}
        onValueChange={bindchange}
        onTintColor={color}
        style={style}
      />
    )
  }
}

export default _Switch
