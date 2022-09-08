/**
 * 其中一点小小不同：
 * selector 跟 multiSelector 实现过程中有点区别，state.value 存的是索引，而 multiSelector 存的是 value 值
 */

import * as React from 'react'
import AntPicker from '@ant-design/react-native/lib/picker'
import { noop } from '../../utils'
import { SelectorProps, SelectorState } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

function convertToObj (item?: any, rangeKey = ''): any {
  if (typeof item === 'object') {
    return { value: item[rangeKey], label: item[rangeKey] }
  } else {
    return { value: item, label: item }
  }
}

export default class Selector extends React.Component<SelectorProps, SelectorState> {
  static defaultProps = {
    range: [],
    value: 0,
  }

  state: any = {
    pRange: [],
    range: [],
    value: 0,
    pValue: '',
  }

  dismissByOk = false

  static getDerivedStateFromProps (nextProps: SelectorProps, lastState: SelectorState): SelectorState | null {
    let ret: any = null
    if (nextProps.range !== lastState.pRange) {
      ret = {
        pRange: nextProps.range,
        range: (nextProps.range || []).map((item) => {
          return convertToObj(item, nextProps.rangeKey)
        })
      }
    }
    if (nextProps.value !== lastState.pValue) {
      ret = ret || {}
      ret.value = nextProps.value
      ret.pValue = nextProps.value
    }
    return ret
  }

  onChange = (): void => {
    const { onChange = noop } = this.props
    const { value } = this.state
    onChange({ detail: { value } })
  }

  onPickerChange = (value: any[]): void => {
    const { range } = this.state
    let selectedIndex = 0
    for (let i = 0; i < range.length; i++) {
      if (range[i].value === value[0]) {
        selectedIndex = i
        break
      }
    }
    this.setState({ value: selectedIndex })
  }

  onOk = (): void => {
    this.dismissByOk = true
  }

  onVisibleChange = (visible: boolean): void => {
    if (!visible && !this.dismissByOk) {
      const { onCancel = noop } = this.props
      onCancel()
    }
    this.dismissByOk = false
  }

  render (): JSX.Element {
    const {
      children,
      disabled,
      itemStyle,
      indicatorStyle,
    } = this.props
    const {
      range,
      value,
    } = this.state

    const selected: any = range[value]

    return (
      // @ts-ignore
      <AntPicker
        data={range}
        value={[selected && selected.value]}
        cols={1}
        itemStyle={itemStyle}
        indicatorStyle={indicatorStyle}
        onChange={this.onChange}
        onPickerChange={this.onPickerChange}
        onOk={this.onOk}
        onVisibleChange={this.onVisibleChange}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>
          {children}
        </TouchableWithoutFeedback>
      </AntPicker>
    )
  }
}
