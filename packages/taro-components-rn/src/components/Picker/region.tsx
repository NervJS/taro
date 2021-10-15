import * as React from 'react'
import AntPicker from '@ant-design/react-native/lib/picker'
import { PickerData } from '@ant-design/react-native/lib/picker/PropsType'
import { regionData } from './regionData'
import { noop } from '../../utils'
import { RegionProps, RegionState, RegionObj } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

function formateRegionData(clObj: RegionObj[] = [], customItem?: string, depth = 2): PickerData[] {
  const l = depth
  const obj: PickerData[] = []
  if (customItem) {
    const objClone: PickerData = {
      value: customItem,
      label: customItem
    }
    const panding = { ...objClone }
    let loop = panding
    while (depth-- > 0) {
      loop.children = [{ ...objClone }]
      loop = loop.children[0]
    }
    obj.push(panding)
  }
  for (let i = 0; i < clObj.length; i++) {
    const region: PickerData = {
      value: clObj[i].value,
      label: clObj[i].value,
    }
    if (clObj[i].children) {
      region.children = formateRegionData(clObj[i].children, customItem, l - 1)
    }
    obj.push(region)
  }
  return obj
}

export default class RegionSelector extends React.Component<RegionProps, RegionState> {
  constructor(props: RegionProps) {
    super(props)
    this.regionData = formateRegionData(props.regionData || regionData, props.customItem)
  }

  static defaultProps = {
    value: [],
  }

  static getDerivedStateFromProps(nextProps: Required<RegionProps>, lastState: RegionState): RegionState | null {
    if (nextProps.value !== lastState.pValue) {
      return {
        value: nextProps.value,
        pValue: nextProps.value
      }
    }
    return null
  }

  state = {
    value: [],
    pValue: []
  }

  dismissByOk = false

  regionData: PickerData[]

  onChange = (value: string[]): void => {
    const { onChange = noop } = this.props
    // 通过 value 查找 code
    let tmp: RegionObj[] = this.props.regionData || regionData
    const postcode: (string | undefined)[] = []
    const code = value.map((item) => {
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].value === item) {
          const code = tmp[i].code
          postcode.push(tmp[i].postcode)
          tmp = tmp[i].children || []
          return code
        }
      }
    }).filter(code => !!code)
    const detail: Record<string, any> = { value, code }
    if (postcode[2]) detail.postcode = postcode[2]
    onChange({ detail })
  }

  onPickerChange = (value: any[]): void => {
    this.setState({ value })
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

  render(): JSX.Element {
    const {
      children,
      disabled,
    } = this.props
    const {
      value,
    } = this.state

    return (
      <AntPicker
        data={this.regionData}
        value={value}
        onChange={this.onChange}
        onPickerChange={this.onPickerChange}
        onOk={this.onOk}
        onVisibleChange={this.onVisibleChange}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </AntPicker>
    )
  }
}
