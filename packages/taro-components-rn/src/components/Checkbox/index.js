/**
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 *
 * @see https://wechat.design/brand/color
 *
 * @flow
 */

import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import Icon from '../Icon'
import styles from './styles'

type Props = {
  style?: StyleSheet.Styles,
  onChange?: Function,
  value?: string,
  disabled?: boolean,
  checked?: boolean,
  color?: string
}
type State = {
  checked: boolean
}

class _Checkbox extends Component<Props, State> {
  props: Props

  static defaultProps = {
    value: '',
    disabled: false,
    checked: false
  }

  state: State = {
    checked: !!this.props.checked
  }

  onPress= () => {
    const { disabled, onChange, value } = this.props

    if (disabled) return

    onChange && onChange({
      value,
      checked: !this.state.checked
    })

    this.setState({ checked: !this.state.checked })
  }

  render () {
    const {
      style,
      value,
      color
    } = this.props

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={[styles.wrapper, style, this.state.checked && styles.wrapperChecked]}>
          <Icon
            type="success_no_circle"
            size={18}
            color="white"
            style={[styles.wrapperIcon, this.state.checked && styles.wrapperCheckedIcon]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Checkbox
