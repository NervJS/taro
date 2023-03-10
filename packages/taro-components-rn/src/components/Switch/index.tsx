/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
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
        onValueChange={disabled ? undefined : this.onCheckedChange}
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
