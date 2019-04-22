/**
 * ✔ onChange(bindchange)
 *
 * @warn No support for props FOR, you must put <Radio /> below <RadioGroup /> straightly.
 * @warn unstable
 */

import * as React from 'react'
import {
  View
} from 'react-native'
import { noop } from '../../utils'
import { RadioGroupProps, RadioGroupState, EventOnChange } from './PropsType'

class _RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {
  state: RadioGroupState = {
    checkedValue: undefined
  }

  onValueChange = (radioOnChangeFn: () => void = noop, e: EventOnChange) => {
    const { onChange = noop } = this.props
    this.setState({ checkedValue: e.value })
    radioOnChangeFn()
    onChange({
      detail: {
        value: e.value
      }
    })
  }

  findAndAttachCb = (children: any): React.ReactNode => {
    return React.Children.toArray(children).map((child) => {
      if (!child.type) return child

      const childTypeName = child.type.name
      if (childTypeName === '_Radio') {
        const { _onGroupDataInitial = noop } = this.props
        const { checkedValue } = this.state
        if (!checkedValue && child.props.checked) {
          _onGroupDataInitial(child.props.value)
        }
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

    const mapChildren: React.ReactNode = this.findAndAttachCb(children)

    return (
      <View style={style}>
        {mapChildren}
      </View>
    )
  }
}

export default _RadioGroup
