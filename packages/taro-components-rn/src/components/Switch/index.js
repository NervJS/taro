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
import Checkbox from '../Checkbox'

type Props = {
  style?: StyleSheet.Styles,
  checked?: boolean,
  type?: 'switch' | 'checkbox',
  onChange?: Function,
  color?: string
}
type State = {
  checked: boolean
}

class _Switch extends Component<Props, State> {
  props: Props

  static defaultProps = {
    type: 'switch',
    color: '#2BA245'
  }

  state: State = {
    checked: !!this.props.checked
  }

  onCheckedChange = (isChecked) => {
    const { onChange } = this.props
    onChange && onChange(isChecked)
    this.setState({ checked: isChecked })
  }

  onCheckboxToggle = (item) => {
    this.onCheckedChange(item.checked)
  }

  render () {
    const {
      style,
      type,
      onChange,
      color
    } = this.props

    if (type === 'checkbox') {
      return (
        <Checkbox
          onChange={this.onCheckboxToggle}
          checked={this.state.checked}
        />
      )
    }

    return (
      <Switch
        value={this.state.checked}
        onValueChange={this.onCheckedChange}
        onTintColor={color}
        style={style}
      />
    )
  }
}

export default _Switch
