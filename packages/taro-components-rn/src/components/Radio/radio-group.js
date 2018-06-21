/**
 * ✔ onChange(bindchange)
 *
 * @warn No support for props FOR, you must put <Radio /> below <RadioGroup /> straightly.
 * @warn unstable
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
  onChange?: Function,
}
type State = {
  checkedValue: ?string
}

class _RadioGroup extends React.Component<Props, State> {
  props: Props
  state: State = {
    checkedValue: null
  }

  onValueChange = (radioOnChangeFn: ?Function, e: { value: * }) => {
    const { onChange } = this.props
    this.setState({ checkedValue: e.value })
    radioOnChangeFn && radioOnChangeFn()
    onChange && onChange({
      detail: {
        value: e.value
      }
    })
  }

  findAndAttachCb = (children: any) => {
    return React.Children.toArray(children).map((child) => {
      if (!child.type) return child

      const childTypeName = child.type.name
      if (childTypeName === '_Radio') {
        const { checkedValue } = this.state
        return React.cloneElement(child, {
          checked: checkedValue === child.props.value,
          onChange: this.onValueChange.bind(this, child.props.onChange)
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
    } = this.props

    const mapChildren = this.findAndAttachCb(children)

    return (
      <View style={style}>
        {mapChildren}
      </View>
    )
  }
}

export default _RadioGroup
