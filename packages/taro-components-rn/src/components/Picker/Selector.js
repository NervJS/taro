/**
 * @flow
 */

import * as React from 'react'
// import {
// } from 'react-native'
import MultiSelector from './MultiSelector'
import { omit } from '../../utils'

type Props = {
  range: Array<any>,
  value: number,
  onChange?: Function,
}

class _PickerSelector extends React.Component<Props> {
  picker: any

  static defaultProps = {
    range: [],
    value: 0,
  }

  // Pass to next ref
  toggleDialog = (isShow: boolean) => {
    this.picker.toggleDialog(isShow)
  }

  onChange = ({ detail: { value } }: Object) => {
    const { onChange } = this.props
    onChange && onChange({ detail: { value: value[0] } })
  }

  render () {
    const {
      range,
      value,
    } = this.props

    return (
      <MultiSelector
        {...omit(this.props, [
          'value',
          'range',
          'onChange',
        ])}
        range={[range]}
        value={[value]}
        onChange={this.onChange}
        ref={(picker) => { this.picker = picker }}
      />
    )
  }
}

export default _PickerSelector
