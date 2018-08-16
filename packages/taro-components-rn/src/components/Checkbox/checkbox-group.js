/**
 * ✔ onChange(bindchange)
 *
 * @warn No support of props FOR, you must put checkbox below label straightly.
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
  onChange?: Function,
  _onGroupDataInitial?: Function,
}

class _CheckboxGroup extends React.Component<Props> {
  props: Props
  values: Array<{ value: any, checked: boolean }> = []
  tmpIndex: number = 0

  getDataFromValues = () => {
    return this.values
      .filter((item) => item.checked)
      .map((item) => item.value)
  }

  toggleChange = (e: { value: *, checked: boolean }, index: number) => {
    const { onChange } = this.props
    this.values[index] = {
      value: e.value,
      checked: e.checked
    }
    onChange && onChange({
      detail: {
        value: this.getDataFromValues()
      }
    })
  }

  findAndAttachCb = (children: any) => {
    return React.Children.toArray(children).map((child) => {
      if (!child.type) return child

      const childTypeName = child.type.name
      if (childTypeName === '_Checkbox') {
        const { value, disabled, checked, color } = child.props
        const index = this.tmpIndex++
        this.values[index] = { value, checked }
        return React.cloneElement(child, {
          onChange: (e) => this.toggleChange(e, index),
          value,
          disabled,
          checked,
          color
        })
      } else {
        return React.cloneElement(child, { ...child.props }, this.findAndAttachCb(child.props.children))
      }
    })
  }

  render () {
    const {
      children,
      style,
      _onGroupDataInitial,
    } = this.props

    this.tmpIndex = 0
    const mapChildren = this.findAndAttachCb(children)
    _onGroupDataInitial && _onGroupDataInitial(this.getDataFromValues())

    return (
      <View style={style}>
        {mapChildren}
      </View>
    )
  }
}

export default _CheckboxGroup
