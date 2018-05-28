/**
 * ✔ onChange(bindchange)
 *
 * @warn No support of props FOR, you must put checkbox below label.
 *
 * @flow
 */

import React, { Component } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
  onChange?: Function
}

class _CheckboxGroup extends Component<Props> {
  props: Props

  values = []

  toggleChange = (e, index) => {
    this.values[index] = {
      value: e.value,
      checked: e.checked
    }
    this.props.onChange({
      detail: {
        value: this.values.filter((item) => item && item.checked).map((item) => item.value)
      }
    })
  }

  render () {
    const {
      children,
      style,
      // onChange
    } = this.props

    const children = React.Children.toArray(children).map((labelItem, index) => {
      const chd = React.Children.toArray(labelItem.props.children).map(child => {
        if (child.name === 'Checkbox') {
          const { value, disabled, checked, color } = child.props
          this.values[index] = { value, checked }
          return React.cloneElement(child, {
            onChange: (e) => this.toggleChange(e, index),
            value,
            disabled,
            checked,
            color
          })
        }
        return child
      })

      return React.cloneElement(labelItem, '', chd)
    })

    return (
      <View style={style}>
        {children}
      </View>
    )
  }
}

export default _CheckboxGroup
