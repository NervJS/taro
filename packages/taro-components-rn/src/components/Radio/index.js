/**
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native'
import Icon from '../Icon'
import styles from './styles'

type Props = {
  style?: StyleSheet.Styles,
  value: *,
  disabled?: boolean,
  checked?: boolean,
  color: string,
  onChange?: Function,
}
type State = {
  checked: boolean
}

class _Radio extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor (props: Props) {
    super(props)
  }

  props: Props
  state: State = {
    checked: !!this.props.checked
  }
  $touchable: React.ElementRef<TouchableWithoutFeedback>

  static defaultProps = {
    value: '',
    color: '#09BB07',
  }

  _simulateNativePress = () => {
    this.$touchable.touchableHandlePress()
  }

  onPress = () => {
    const { disabled, onChange, value } = this.props

    if (disabled) return

    if (this.state.checked) return

    onChange && onChange({
      value,
      checked: !this.state.checked
    })

    this.setState({ checked: !this.state.checked })
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({ checked: !!nextProps.checked })
    }
  }

  render () {
    const {
      style,
      color,
    } = this.props

    const isChecked = this.state.checked
    const iconSize = Platform.OS === 'ios' ? 24 : 21

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
