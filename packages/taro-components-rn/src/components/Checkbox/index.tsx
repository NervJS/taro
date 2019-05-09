/**
 * 半受控组件
 *
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 *
 * @see https://wechat.design/brand/color
 */

import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  GestureResponderEvent
} from 'react-native'
import Icon from '../Icon'
import styles from './styles'
import { noop } from '../../utils'
import { CheckboxProps, CheckboxState } from './PropsType'

class _Checkbox extends React.Component<CheckboxProps, CheckboxState> {
  static defaultProps = {
    value: '',
    color: '#09BB07',
  }

  static getDerivedStateFromProps (props: CheckboxProps, state: CheckboxState) {
    return props.checked !== state.checked ? {
      checked: !!props.checked
    } : null
  }

  $touchable: TouchableWithoutFeedback | null

  state: CheckboxState = {
    checked: false
  }

  _simulateNativePress = (evt: GestureResponderEvent) => {
    this.$touchable && this.$touchable.touchableHandlePress(evt)
  }

  onPress = () => {
    const { disabled, onChange = noop, value } = this.props

    if (disabled) return

    onChange({
      value,
      checked: !this.state.checked
    })

    this.setState({ checked: !this.state.checked })
  }

  render () {
    const {
      style,
      color,
    } = this.props

    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
        ref={(touchable) => { this.$touchable = touchable }}
      >
        <View style={[styles.wrapper, style, this.state.checked && styles.wrapperChecked]}>
          <Icon
            type="success_no_circle"
            size={18}
            color={color}
            style={[styles.wrapperIcon, this.state.checked && styles.wrapperCheckedIcon]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Checkbox
