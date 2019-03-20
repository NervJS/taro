import * as React from 'react'
import { Picker as AntPicker } from '@ant-design/react-native'
import regionData from './regions.formatted'
import { RegionProps } from './PropsType'

export default class RegionSelector extends React.Component<RegionProps, any> {
  static defaultProps = {
    value: [],
  }
  state = {
    value: []
  }

  static getDerivedStateFromProps (nextProps: RegionProps, lastState: any) {
    if (nextProps.value !== lastState.value) {
      return {
        value: nextProps.value
      }
    }
    return null
  }

  onChange = (value: string[]) => {
    const { onChange } = this.props
    // 通过 value 查找 code
    let tmp: any[] = regionData
    const code = value.map((item) => {
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].value === item) {
          const code = tmp[i].code
          tmp = tmp[i].children || []
          return code
        }
      }
    })
    onChange && onChange({ detail: { value, code } })
  }

  onPickerChange = (value: any[]) => {
    this.setState({ value })
  }

  onDismiss = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  render () {
    const {
      children,
      disabled,
    } = this.props
    const {
      value,
    } = this.state

    return (
      <AntPicker
        data={regionData}
        value={value}
        onChange={this.onChange}
        onPickerChange={this.onPickerChange}
        onDismiss={this.onDismiss}
        disabled={disabled}
      >
        {children}
      </AntPicker>
    )
  }
}
