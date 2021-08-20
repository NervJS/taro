/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
