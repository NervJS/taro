/**
 * ✔ checked
 * ✔ disabled
 * ✔ type
 * ✔ onChange(bindchange) :isChecked
 * ✔ color
 *
 * @warn When type="switch", use native Switch
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
  static displayName = '_Switch'
  static defaultProps = {
    type: 'switch',
    color: '#04BE02',
    disabled: false,
  }

  // $touchable: Checkbox | Switch | null
  $touchable = React.createRef<Checkbox | Switch>()

  state: SwitchState = {
    checked: !!this.props.checked
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    const { type } = this.props
    if (type === 'checkbox') {
      const node = this.$touchable.current as Checkbox
      node && node._simulateNativePress(evt)
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

  render (): JSX.Element {
    const {
      style,
      type,
      color,
      disabled
    } = this.props

    if (type === 'checkbox') {
      return (
        <Checkbox
          onChange={this.onCheckboxToggle}
          checked={this.state.checked}
          disabled={disabled}
          ref={this.$touchable as React.RefObject<Checkbox>}
        />
      )
    }

    return (
      <Switch
        value={this.state.checked}
        onValueChange={this.onCheckedChange}
        trackColor={{ false: '#FFFFFF', true: color }}
        ios_backgroundColor="#FFFFFF"
        style={style}
        disabled={disabled}
        ref={this.$touchable as React.RefObject<Switch>}
      />
    )
  }
}

export default _Switch
