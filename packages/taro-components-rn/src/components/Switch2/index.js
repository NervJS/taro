/**
 * ✔ checked
 * ✔ type
 * ✔ onChange(bindchange) :isChecked
 * ✔ color
 *
 * @warn When type="switch", use native Switch
 * @see https://wechat.design/brand/color
 * @example
 *  <Switch
 *    checked={this.state.isSwitchChecked}
 *    onChange={this.onSwitchChange}
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
  onChange?: Function,
  color?: string
}

class _Switch extends Component<Props> {
  props: Props

  static defaultProps = {
    type: 'switch',
    color: '#2BA245'
  }

  onCheckboxToggle = (item) => {
    const { onChange } = this.props
    onChange && onChange(item.checked)
  }

  render () {
    const {
      style,
      checked,
      type,
      onChange,
      color
    } = this.props

    if (type === 'checkbox') {
      return (
        <Checkbox
          onChange={this.onCheckboxToggle}
          checked={checked}
        />
      )
    }

    return (
      <Switch
        value={checked}
        onValueChange={onChange}
        onTintColor={color}
        style={style}
      />
    )
  }
}

export default _Switch
