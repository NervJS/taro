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
import { TouchableWithoutFeedback, GestureResponderEvent } from 'react-native'
import Icon from '../Icon'
import View from '../View'
import styles from './styles'
import { noop } from '../../utils'
import { CheckboxProps, CheckboxState } from './PropsType'

class _Checkbox extends React.Component<CheckboxProps, CheckboxState> {
  static displayName = '_Checkbox'
  static defaultProps = {
    value: '',
    color: '#09BB07'
  }

  static getDerivedStateFromProps(props: CheckboxProps, state: CheckboxState): CheckboxState | null {
    return props.checked !== state.checked
      ? {
        checked: !!props.checked
      }
      : null
  }

  $touchable = React.createRef<TouchableWithoutFeedback>()

  state: CheckboxState = {
    checked: false,
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    const node = this.$touchable.current
    node && node.props.onPress && node.props.onPress(evt)
  }

  onPress = (): void => {
    const { disabled, onChange = noop, value } = this.props
    if (disabled) return
    const checked = !this.state.checked
    onChange({
      value,
      checked
    })

    this.setState({ checked })
  }

  render(): JSX.Element {
    const { style, color } = this.props
    const { checked } = this.state

    return (
      <TouchableWithoutFeedback onPress={this.onPress} ref={this.$touchable}>
        <View style={styles.container}>
          <View style={[styles.wrapper, style, checked && styles.wrapperChecked]}>
            <Icon
              type="success_no_circle"
              size={18}
              color={color}
              style={[styles.wrapperIcon, checked && styles.wrapperCheckedIcon]}
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

export default _Checkbox
