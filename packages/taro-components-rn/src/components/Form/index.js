/**
 * ✘ report-submit
 * ✔ onSubmit(bindsubmit): no FormId info.
 * ✘ onReset(bindreset)
 *
 * @flow
 */

import * as React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

type Props = {
  children: ?React.Node,
  style?: StyleSheet.Styles,
  onSubmit?: Function,
  onReset?: Function
}
type State = {
}

function isFormTypeElement (typeName) {
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

class _Form extends React.Component<Props, State> {
  props: Props
  state: State = {
  }
  formValues: Object = {}

  bindValueChangeEvent = (child) => {
    // onChange: _CheckboxGroup _RadioGroup _Switch _Slider _Picker
    // onBlur: _Input _Textarea
    const childTypeName = child.type.name
    const childPropsName = child.props.name
    const valueChangeCbName = childTypeName === '_Input' || childTypeName === '_Textarea' ? 'onBlur' : 'onChange'
    const tmpProps = { ...child.props }
    // Initial value
    if (['_Input', '_Textarea', '_Slider', '_Picker'].indexOf(childTypeName) >= 0) {
      this.formValues[childPropsName] = child.props.value
    } else if (childTypeName === '_Switch') {
      this.formValues[childPropsName] = !!child.props.checked
    } else {
      tmpProps._onGroupDataInitial = (value) => {
        this.formValues[childPropsName] = value
      }
    }
    tmpProps[valueChangeCbName] = (event) => {
      const cb = child.props[valueChangeCbName]
      this.formValues[childPropsName] = event.detail.value
      cb && cb(...arguments)
    }
    return React.cloneElement(child, tmpProps, child.props.children)
  }

  deppDiveIntoChildren = (children) => {
    return React.Children.toArray(children).map((child) => {
      const childTypeName = child.type.name
      if (!child.type) return child
      if (childTypeName === '_Button' && ['submit', 'reset'].indexOf(child.props.formType) >= 0) {
        const onClick = child.props.onClick
        return React.cloneElement(child, {
          ...child.props,
          onClick: () => {
            this[child.props.formType]()
            onClick && onClick()
          }
        })
      }
      return isFormTypeElement(childTypeName) && child.props.name ?
        this.bindValueChangeEvent(child) :
        React.cloneElement(child, { ...child.props }, this.deppDiveIntoChildren(child.props.children))
    })
  }

  submit = () => {
    const { onSubmit } = this.props
    onSubmit && onSubmit({
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
