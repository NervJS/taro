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
 * 半受控组件
 *
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 */

import * as React from 'react'
import { TouchableWithoutFeedback, GestureResponderEvent } from 'react-native'
import Icon from '../Icon'
import View from '../View'
import styles from './styles'
import { noop } from '../../utils'
import { RadioProps, RadioState } from './PropsType'

class _Radio extends React.Component<RadioProps, RadioState> {
  static displayName = '_Radio'
  static defaultProps = {
    value: '',
    color: '#09BB07'
  }

  static getDerivedStateFromProps(props: RadioProps, state: RadioState): RadioState | null {
    return props.checked !== state.checked
      ? {
        checked: !!props.checked
      }
      : null
  }

  $touchable = React.createRef<TouchableWithoutFeedback>()

  state: RadioState = {
    checked: false
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    const node = this.$touchable.current
    node && node.props.onPress && node.props.onPress(evt)
  }

  onPress = (): void => {
    const { disabled, onChange = noop, value } = this.props

    if (disabled) return

    if (this.state.checked) return

    onChange({
      value,
      checked: !this.state.checked
    })

    this.setState({ checked: !this.state.checked })
  }

  render(): JSX.Element {
    const { style, color } = this.props

    const isChecked: boolean = this.state.checked

    return (
      <TouchableWithoutFeedback onPress={this.onPress} ref={this.$touchable}>
        <View style={styles.container}>
          <View
            style={[styles.wrapper, isChecked && styles.wrapperChecked, isChecked && { borderColor: color }, style]}
          >
            <Icon
              type="success"
              size={24}
              color={color}
              style={[styles.wrapperIcon, isChecked && styles.wrapperCheckedIcon]}
            />
          </View>
          <View style={{ flexGrow: 0 }}>
            {this.props.children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Radio
