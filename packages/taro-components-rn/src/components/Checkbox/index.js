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

class _Checkbox extends Component<Props> {
  props: Props

  static defaultProps = {
    value: '',
    disabled: false,
    checked: false
  }

  onPress= () => {
    const { onChange, value, checked } = this.props
    onChange && onChange({
      value,
      checked: !checked
    })
  }

  render () {
    const {
      style,
      value,
      disabled,
      checked,
      color
    } = this.props

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={[styles.wrapper, style, checked && styles.wrapperChecked]}>
          <Icon
            type="success_no_circle"
            size={18}
            color="white"
            style={[styles.wrapperIcon, checked && styles.wrapperCheckedIcon]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Checkbox
