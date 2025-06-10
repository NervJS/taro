import { PickerData } from '@ant-design/react-native/lib/picker/PropsType'
import { PickerViewProps as __PickerViewProps } from '@ant-design/react-native/lib/picker-view/PickerView'
import { PickerViewProps as _PickerViewProps } from '@tarojs/components/types/PickerView'

export interface PickerViewProps extends _PickerViewProps, __PickerViewProps {
  data: PickerData[] | PickerData[][]
  style: any
  indicatorStyle?: any
  onChange?: () => void
  value: any[]
}
