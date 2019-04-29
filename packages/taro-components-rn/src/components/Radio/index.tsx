/**
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
  // eslint-disable-next-line no-useless-constructor
  constructor (props: RadioProps) {
    super(props)
  }

  $touchable: TouchableWithoutFeedback | null

  state: RadioState = {
    checked: !!this.props.checked
  }

  static defaultProps = {
    value: '',
    color: '#09BB07',
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    this.$touchable && this.$touchable.touchableHandlePress(evt)
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: RadioProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({ checked: !!nextProps.checked })
    }
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
        ref={(touchable) => { this.$touchable = touchable }}
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
