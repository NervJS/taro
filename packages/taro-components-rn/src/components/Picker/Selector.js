/**
 * @flow
 */

import * as React from 'react'
import {
  View,
  Picker,
  Platform,
} from 'react-native'
import MultiSelector from './MultiSelector'

type Props = {
  range: Array<any>,
  value: number,
  onChange?: Function,
}

class _PickerSelector extends React.Component<Props> {
  picker: any

  // Pass to next ref
  toggleDialog = (isShow: boolean) => {
    this.picker.toggleDialog(isShow)
  }

  onChange = ({ detail: { value } }) => {
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
        {...this.props}
        range={[range]}
        value={[value]}
        onChange={this.onChange}
        ref={(picker) => { this.picker = picker }}
      />
    )
  }
}

export default _PickerSelector
