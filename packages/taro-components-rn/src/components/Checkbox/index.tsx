/**
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
  // eslint-disable-next-line no-useless-constructor
  constructor (props: CheckboxProps) {
    super(props)
  }

  $touchable: TouchableWithoutFeedback | null

  state: CheckboxState = {
    checked: !!this.props.checked
  }

  static defaultProps = {
    value: '',
    color: '#09BB07',
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: CheckboxProps) {
    if (this.state.checked !== nextProps.checked) {
      this.setState({ checked: !!nextProps.checked })
    }
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
