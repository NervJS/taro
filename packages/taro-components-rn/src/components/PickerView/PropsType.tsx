import { PickerColumnItem } from '@ant-design/react-native/lib/picker'
import { PickerViewProps as __PickerViewProps } from '@ant-design/react-native/lib/picker-view'
import { PickerViewProps as _PickerViewProps } from '@tarojs/components/types/PickerView'

export interface PickerViewProps extends _PickerViewProps, Omit<__PickerViewProps, 'defaultValue'> {
  data: PickerColumnItem[] | PickerColumnItem[][]
  style: any
  indicatorStyle?: any
  onChange?: () => void
  value: any[]
}
