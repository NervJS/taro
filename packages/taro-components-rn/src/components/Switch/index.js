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
  state: State = {
    checked: !!this.props.checked
  }
  $touchable: ?React.ElementRef<Switch>

  static defaultProps = {
    type: 'switch',
    color: '#04BE02'
  }

  _simulateNativePress = () => {
    const { type } = this.props
    if (type === 'checkbox') {
      this.$touchable && this.$touchable._simulateNativePress()
    } else {
      // this.$touchable._onChange()
      this.setState({ checked: !this.state.checked })
    }
  }

  onCheckedChange = (isChecked: boolean) => {
    const { onChange } = this.props
    onChange && onChange({ detail: { value: isChecked } })
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
