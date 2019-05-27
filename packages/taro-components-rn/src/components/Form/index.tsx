/**
 * ✘ report-submit
 * ✔ onSubmit(bindsubmit): no FormId info.
 * ✘ onReset(bindreset)
 */

import * as React from 'react'
import {
  View
} from 'react-native'
import { noop } from '../../utils'
import { FormProps, FormValues } from './PropsType'

function isFormTypeElement (typeName: string): boolean {
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

  bindValueChangeEvent = (child: any) => {
    // onChange: _CheckboxGroup _RadioGroup _Switch _Slider _Picker
    // onBlur: _Input _Textarea
    const childTypeName = child.type && child.type.name
    const childPropsName = child.props.name
    const valueChangeCbName = childTypeName === '_Input' || childTypeName === '_Textarea' ? 'onBlur' : 'onChange'
    const tmpProps = { ...child.props }
    // Initial value
    if (['_Input', '_Textarea', '_Slider', '_Picker'].indexOf(childTypeName) >= 0) {
      this.formValues[childPropsName] = child.props.value
    } else if (childTypeName === '_Switch') {
      this.formValues[childPropsName] = !!child.props.checked
    } else {
      tmpProps._onGroupDataInitial = (value: any) => {
        this.formValues[childPropsName] = value
      }
    }
    const self = this
    tmpProps[valueChangeCbName] = function (event: any) {
      const valueChangeCb = child.props[valueChangeCbName] || noop
      self.formValues[childPropsName] = event.detail.value
      valueChangeCb(...arguments)
    }
    return React.cloneElement(child, tmpProps, child.props.children)
  }

  deppDiveIntoChildren = (children: any): React.ReactNode => {
    return React.Children.toArray(children).map((child) => {
      const childTypeName = child.type && child.type.name
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
  }

  submit = () => {
    const { onSubmit = noop } = this.props
    onSubmit({
      detail: {
        value: this.formValues
      }
    })
  }

  reset = () => {
  }

  render () {
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
