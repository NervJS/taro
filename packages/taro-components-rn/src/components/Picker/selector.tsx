/**
 * 其中一点小小不同：
 * selector 跟 multiSelector 实现过程中有点区别，state.value 存的是索引，而 multiSelector 存的是 value 值
 */

import * as React from 'react'
import AntPicker from '@ant-design/react-native/lib/picker'
import { noop } from '../../utils'
import { SelectorProps } from './PropsType'

function convertToObj (item?: any, rangeKey: string = ''): any {
  if (typeof item === 'object') {
    return { value: item[rangeKey], label: item[rangeKey] }
  } else {
    return { value: item, label: item }
  }
}

export default class Selector extends React.Component<SelectorProps, any> {
  static defaultProps = {
    range: [],
    value: 0,
  }

  state: any = {
    pRange: [],
    range: [],
    value: 0,
  }

  static getDerivedStateFromProps (nextProps: SelectorProps, lastState: any) {
    let ret: any = null
    if (nextProps.range !== lastState.pRange) {
      ret = {
        pRange: nextProps.range,
        range: (nextProps.range || []).map((item) => {
          return convertToObj(item, nextProps.rangeKey)
        })
      }
    }
    if (nextProps.value !== lastState.value) {
      ret = ret || {}
      ret.value = nextProps.value
    }
    return ret
  }

  onChange = () => {
    const { onChange = noop } = this.props
    const { value } = this.state
    onChange({ detail: { value } })
  }

  onPickerChange = (value: any[]) => {
    const { range } = this.state
    let selectedIndex: number = 0
    for (let i = 0; i < range.length; i++) {
      if (range[i].value === value[0]) {
        selectedIndex = i
        break
      }
    }
    this.setState({ value: selectedIndex })
  }

  onDismiss = () => {
    const { onCancel = noop } = this.props
    onCancel()
  }

  render () {
    const {
      children,
      disabled,
    } = this.props
    const {
      range,
      value,
    } = this.state

    const selected: any = range[value]

    return (
      <AntPicker
        data={range}
        value={[selected && selected.value]}
        cols={1}
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
