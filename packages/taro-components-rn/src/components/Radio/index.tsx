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
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  GestureResponderEvent
} from 'react-native'
import Icon from '../Icon'
import styles from './styles'
import { noop } from '../../utils'
import { RadioProps, RadioState } from './PropsType'

class _Radio extends React.Component<RadioProps, RadioState> {
  static defaultProps = {
    value: '',
    color: '#09BB07',
  }

  static getDerivedStateFromProps (props: RadioProps, state: RadioState) {
    return props.checked !== state.checked ? {
      checked: !!props.checked
    } : null
  }

  $touchable = React.createRef<TouchableWithoutFeedback>()

  state: RadioState = {
    checked: false
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    const node = this.$touchable.current
    node && node.touchableHandlePress(evt)
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

  render () {
    const {
      style,
      color,
    } = this.props

    const isChecked: boolean = this.state.checked
    const iconSize: number = Platform.OS === 'ios' ? 24 : 21

    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
        ref={this.$touchable}
      >
        <View style={[
          styles.wrapper,
          isChecked && styles.wrapperChecked,
          isChecked && { borderColor: color },
          style
        ]}>
          <Icon
            type="success"
            size={iconSize}
            color={color}
            style={[styles.wrapperIcon, isChecked && styles.wrapperCheckedIcon]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Radio
