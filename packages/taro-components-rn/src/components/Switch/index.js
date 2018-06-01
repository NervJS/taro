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

import * as React from 'react'
import {
  Switch,
  StyleSheet,
} from 'react-native'
import Checkbox from '../Checkbox'

type Props = {
  style?: StyleSheet.Styles,
  checked?: boolean,
  type: 'switch' | 'checkbox',
  onChange?: Function,
  color: string | number
}
type State = {
  checked: boolean
}

class _Switch extends React.Component<Props, State> {
  props: Props

  static defaultProps = {
    type: 'switch',
    color: '#2BA245'
  }

  state: State = {
    checked: !!this.props.checked
  }

  onCheckedChange = (isChecked: boolean) => {
    const { onChange } = this.props
    onChange && onChange(isChecked)
    this.setState({ checked: isChecked })
  }

  onCheckboxToggle = (item: { checked: boolean }) => {
    this.onCheckedChange(item.checked)
  }

  render () {
    const {
      style,
      type,
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
