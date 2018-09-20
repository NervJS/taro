/**
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 *
 * @see https://wechat.design/brand/color
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
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

class _Checkbox extends React.Component<Props, State> {
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

    onChange && onChange({
      value,
      checked: !this.state.checked
    })

    this.setState({ checked: !this.state.checked })
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
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
