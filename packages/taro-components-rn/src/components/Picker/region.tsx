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
  static getDerivedStateFromProps(nextProps: RegionProps, lastState: RegionState): Partial<RegionState> | null {
    // eslint-disable-next-line eqeqeq
    const isControlled = nextProps.value != undefined
    if (isControlled) {
      if (nextProps.value !== lastState.pValue) {
        // 受控更新
        return {
          pValue: nextProps.value,
          value: nextProps.value
        }
      } else if (lastState.isInOnChangeUpdate && nextProps.value !== lastState.value) {
        // 受控还原
        return {
          value: nextProps.value,
          isInOnChangeUpdate: false
        }
      }
    } else if (nextProps.value !== lastState.pValue) {
      // 初次更新才设置 defaultValue
      return {
        pValue: nextProps.value,
        value: nextProps.defaultValue ?? []
      }
    }
    return null
  }

  state = {
    value: [],
    pValue: [],
    isInOnChangeUpdate: false,
  }

  dismissByOk = false

  regionData = formateRegionData(this.props.regionData || regionData, this.props.customItem)

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
    this.setState({ value, isInOnChangeUpdate: true })
    onChange({ detail })
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
      // @ts-ignore
      <AntPicker
        data={this.regionData}
        value={value}
        onChange={this.onChange}
        onOk={this.onOk}
        onVisibleChange={this.onVisibleChange}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </AntPicker>
    )
  }
}
