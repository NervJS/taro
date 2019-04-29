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
 */

import * as React from 'react'
import {
  Switch,
  GestureResponderEvent
} from 'react-native'
import Checkbox from '../Checkbox'
import { noop } from '../../utils'
import { SwitchProps, SwitchState } from './PropsType'

class _Switch extends React.Component<SwitchProps, SwitchState> {
  $touchable: Checkbox | Switch | null

  state: SwitchState = {
    checked: !!this.props.checked
  }

  static defaultProps = {
    type: 'switch',
    color: '#04BE02'
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    const { type } = this.props
    if (type === 'checkbox') {
      this.$touchable && (this.$touchable as Checkbox)._simulateNativePress(evt)
    } else {
      // this.$touchable._onChange()
      this.setState({ checked: !this.state.checked })
    }
  }

  onCheckedChange = (isChecked: boolean): void => {
    const { onChange = noop } = this.props
    onChange({ detail: { value: isChecked } })
    this.setState({ checked: isChecked })
  }

  onCheckboxToggle = (item: { checked: boolean }): void => {
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
          ref={(touchable) => { this.$touchable = touchable }}
        />
      )
    }

    return (
      <Switch
        value={this.state.checked}
        onValueChange={this.onCheckedChange}
        onTintColor={color}
        style={style}
        ref={(touchable) => { this.$touchable = touchable }}
      />
    )
  }
}

export default _Switch
