import * as React from 'react'
import AntPicker from '@ant-design/react-native/lib/picker'
import { noop } from '../../utils'
import { MultiSelectorProps } from './PropsType'

/**
 * 比较数组内每个数值
 *
 * @returns true = same, false = different
 */
function shallowDiffValue (value: number[] = [], lastValue: number[] = []): boolean {
  if (value.length !== lastValue.length) return false
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== lastValue[i]) {
      return false
    }
  }
  return true
}

function convertToObj (item?: any, rangeKey: string = ''): any {
  if (typeof item === 'object') {
    return { value: item[rangeKey], label: item[rangeKey] }
  } else {
    return { value: item, label: item }
  }
}

function formatRange (range: any[][] = [], rangeKey?: string): any[] {
  const result = (range[0] || []).map((item) => {
    return convertToObj(item, rangeKey)
  })
  let tmp = result
  for (let i = 1; i < range.length; i++) {
    const nextColData = (range[i] || []).map((item) => {
      return convertToObj(item, rangeKey)
    })
    tmp.forEach((item) => {
      item.children = nextColData
    })
    tmp = nextColData
  }
  return result
}

function getIndexByValues (range: any[] = [], value: any[] = []): number[] {
  let tmp = range
  return value.map((v) => {
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].value === v) {
        tmp = tmp[i].children || []
        return i
      }
    }
    return 0
  })
}

export default class MultiSelector extends React.Component<MultiSelectorProps, any> {
  static defaultProps = {
    range: [],
    value: [],
  }

  state = {
    cols: 3,
    pRange: [],
    pValue: [],
    range: [],
    value: []
  }

  static getDerivedStateFromProps (nextProps: MultiSelectorProps, lastState: any) {
    let ret: any = null

    if (nextProps.range !== lastState.pRange) {
      ret = ret || {}
      nextProps.range && (ret.cols = nextProps.range.length)
      ret.pRange = nextProps.range
      ret.range = formatRange(nextProps.range, nextProps.rangeKey)
      // ------------------------------------------------------------------
      // ⚠️@todo range 变 value 不变，这种情况下，因为 value 没变，用户切换不了选项
      // ------------------------------------------------------------------
    }

    if (!shallowDiffValue(nextProps.value, lastState.pValue)) {
      ret = ret || {}
      ret.pValue = nextProps.value
      let tmp = (ret && ret.range) || lastState.range
      ret.value = (nextProps.value || []).map((valIndex: number = 0) => {
        const v = tmp[valIndex] && tmp[valIndex].value
        tmp = (tmp[valIndex] && tmp[valIndex].children) || []
        return v
      })
    }

    return ret
  }

  onChange = (value: any[]) => {
    const { onChange = noop } = this.props
    const { range } = this.state
    onChange({ detail: { value: getIndexByValues(range, value) } })
  }

  onPickerChange = (value: any[]) => {
    const { onColumnChange = noop } = this.props
    const { range, value: stateValue } = this.state
    const indexes = getIndexByValues(range, value)
    // 通过比对确定是哪一列数据变了
    let changingColIndex: number = 0
    for (let i = 0; i < stateValue.length; i++) {
      if (stateValue[i] !== value[i]) {
        changingColIndex = i
        break
      }
    }
    onColumnChange({ detail: { column: changingColIndex, value: indexes[changingColIndex] } })
    this.setState({ value })
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
      cols,
      range,
      value,
    } = this.state

    return (
      <AntPicker
        data={range}
        value={value}
        cols={cols}
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
