import * as React from 'react'
import AntPicker from '@ant-design/react-native/lib/picker'
import regionData from './regions.formatted'
import { noop } from '../../utils'
import { RegionProps, RegionState } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

export default class RegionSelector extends React.Component<RegionProps, RegionState> {
  static defaultProps = {
    value: [],
  }

  static getDerivedStateFromProps (nextProps: RegionProps, lastState: RegionState): RegionState | null {
    if (nextProps.value !== lastState.pvalue) {
      return {
        value: nextProps.value,
        pvalue: nextProps.value
      }
    }
    return null
  }

  state = {
    value: [],
    pvalue: []
  }

  onChange = (value: string[]): void => {
    const { onChange = noop } = this.props
    // 通过 value 查找 code
    let tmp: any[] = regionData
    // eslint-disable-next-line array-callback-return
    const code = value.map((item) => {
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].value === item) {
          const code = tmp[i].code
          tmp = tmp[i].children || []
          return code
        }
      }
    })
    onChange({ detail: { value, code } })
  }

  onPickerChange = (value: any[]): void => {
    this.setState({ value })
  }

  onDismiss = (): void => {
    const { onCancel = noop } = this.props
    onCancel()
  }

  render (): JSX.Element {
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
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </AntPicker>
    )
  }
}
