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
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'
import Icon from '../icon'
import styles from './styles'

type Props = {
  style?: StyleSheet.Styles,
  bindchange?: Function,
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
    const { bindchange, value, checked } = this.props
    bindchange && bindchange({
      value,
      checked: !checked
    })
  }

  render () {
    const {
      style,
      bindchange,
      value,
      disabled,
      checked,
      color
    } = this.props

    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
        style={[styles.wrapper, style, wrapperChecked]}
      >
        <Icon
          type="success_no_circle"
          size="10"
          color="white"
          style="[wrapperIcon, checked && wrapperCheckedIcon]"
        />
      </TouchableWithoutFeedback>
    )
  }
}

export default _Checkbox
