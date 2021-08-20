/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
