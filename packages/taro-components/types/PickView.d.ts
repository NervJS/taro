import { ComponentType } from 'react'
import { StandardProps, BaseEventFunction } from './common'

interface PickerViewProps extends StandardProps {

  /**
   * 数组中的数字依次表示 picker-view 内的 picker-view-column 选择的第几项（下标从 0 开始），数字大于 picker-view-column 可选项长度时，选择最后一项。
   */
  value: number[]

  /**
   * 设置选择器中间选中框的样式
   */
  indicatorStyle?: string,

  /**
   * 设置选择器中间选中框的类名
   */
  indicatorClass?: string,

  /**
   * 设置蒙层的样式
   */
  maskStyle?: string,

  /**
   * 设置蒙层的类名
   */
  maskClass?: string,

  /**
   * 当滚动选择，value 改变时触发 change 事件，event.detail = {value: value}；value为数组，表示 picker-view 内的 picker-view-column 当前选择的是第几项（下标从 0 开始）
   */
  onChange: BaseEventFunction
}

declare const PickerView: ComponentType<PickerViewProps>

export { PickerView }
