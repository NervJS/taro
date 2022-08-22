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
  static displayName = '_RadioGroup'
  state: RadioGroupState = {
    checkedValue: undefined
  }

  // eslint-disable-next-line default-param-last
  onValueChange = (radioOnChangeFn: () => void = noop, e: EventOnChange): void => {
    const { onChange = noop } = this.props
    this.setState({ checkedValue: e.value })
    radioOnChangeFn()
    onChange({
      detail: {
        value: e.value
      }
    })
  }

  findAndAttachCb = (children: React.ReactNode): React.ReactNode => {
    return React.Children.toArray(children).map((child: any) => {
      if (!child.type) return child

      const childTypeName = child.type.displayName
      if (childTypeName === '_Radio') {
        const { _onGroupDataInitial = noop } = this.props
        const { checkedValue } = this.state
        if (!checkedValue && child.props.checked) {
          _onGroupDataInitial(child.props.value)
        }
        return React.cloneElement(child, {
          checked: checkedValue ? checkedValue === child.props.value : child.props.checked,
          onChange: this.onValueChange.bind(this, child.props.onChange)
        })
      } else {
        return React.cloneElement(child, { ...child.props }, this.findAndAttachCb(child.props.children))
      }
    })
  }

  render (): JSX.Element {
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
