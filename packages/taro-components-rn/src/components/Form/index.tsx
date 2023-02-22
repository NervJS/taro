/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import * as React from 'react'
import {
  View
} from 'react-native'
import { noop } from '../../utils'
import { FormProps, FormValues } from './PropsType'

function isFormTypeElement(typeName: string): boolean {
  return [
    '_Input',
    '_Textarea',
    '_CheckboxGroup',
    '_RadioGroup',
    '_Switch',
    '_Slider',
    '_Picker'
  ].indexOf(typeName) >= 0
}

class _Form extends React.Component<FormProps> {
  formValues: FormValues = {}

  bindValueChangeEvent = (child: React.ReactElement): React.ReactNode => {
    // onChange: _CheckboxGroup _RadioGroup _Switch _Slider _Picker
    // onBlur: _Input _Textarea
    // @ts-ignore
    const childTypeName = child.type && child.type.displayName
    const childPropsName = child.props.name
    const valueChangeCbName = childTypeName === '_Input' || childTypeName === '_Textarea' ? 'onBlur' : 'onChange'
    const tmpProps = { ...child.props }
    // Initial value
    if (['_Input', '_Textarea', '_Slider', '_Picker'].indexOf(childTypeName) >= 0) {
      if (child.props.value !== undefined) {
        this.formValues[childPropsName] = child.props.value
      }
    } else if (childTypeName === '_Switch') {
      if (child.props.checked !== undefined) {
        this.formValues[childPropsName] = !!child.props.checked
      }
    } else {
      tmpProps._onGroupDataInitial = (value: any) => {
        this.formValues[childPropsName] = value
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    tmpProps[valueChangeCbName] = function (event: any) {
      const valueChangeCb = child.props[valueChangeCbName] || noop
      self.formValues[childPropsName] = event.detail.value
      // eslint-disable-next-line prefer-rest-params
      valueChangeCb(...arguments)
    }
    return React.cloneElement(child, tmpProps, child.props.children)
  }

  deppDiveIntoChildren = (children: React.ReactNode): React.ReactNode => {
    const result = React.Children.toArray(children).map((child: any) => {
      const childTypeName = child.type && child.type.displayName
      if (!child.type) return child
      if (childTypeName === '_Button' && ['submit', 'reset'].indexOf(child.props.formType) >= 0) {
        const onClick = child.props.onClick || noop
        return React.cloneElement(child, {
          ...child.props,
          onClick: () => {
            const formType: 'submit' | 'reset' = child.props.formType
            this[formType]()
            onClick()
          }
        })
      }
      return isFormTypeElement(childTypeName) && child.props.name
        ? this.bindValueChangeEvent(child)
        : React.cloneElement(child, { ...child.props }, this.deppDiveIntoChildren(child.props.children))
    })
    return result.length ? result : null
  }

  submit = (): void => {
    const { onSubmit = noop } = this.props
    onSubmit({
      detail: {
        value: this.formValues
      }
    })
  }

  reset = (): void => {
    const { onReset = noop } = this.props
    onReset()
  }

  render(): JSX.Element {
    const {
      children,
      style,
    } = this.props

    return (
      <View style={style}>
        {this.deppDiveIntoChildren(children)}
      </View>
    )
  }
}

export default _Form
