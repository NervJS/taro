import { ComponentType } from 'react'
import { StandardProps, BaseEventFunction } from './common'

interface PickerStandardProps extends StandardProps {
  /**
   * 是否禁用
   *
   * 默认值：`false`
   */
  disabled?: boolean
  /**
   * 当滚动选择，value 改变时触发 change 事件，event.detail = {value: value}；value为数组，表示 picker-view 内的 picker-view-column 当前选择的是第几项（下标从 0 开始）
   */
  onChange: BaseEventFunction
  /**
   * 取消选择或点遮罩层收起 picker 时触发
   */
  onCancel?: BaseEventFunction
}

interface PickerSelectorProps extends PickerStandardProps {
  /**
   * 从底部弹起的滚动选择器，现支持五种选择器，通过mode来区分，分别是普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器，默认是普通选择器
   */
  mode: 'selector'
  /**
   * mode为 selector 或 multiSelector 时，range 有效
   */
  range: string[] | number[] | Object[]
  /**
   * 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
   */
  rangeKey?: string
  /**
   * value 的值表示选择了 range 中的第几个（下标从 0 开始）
   */
  value: number
}

interface PickerMultiSelectorProps extends PickerStandardProps {
  /**
   * 从底部弹起的滚动选择器，现支持五种选择器，通过mode来区分，分别是普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器，默认是普通选择器
   */
  mode: 'multiSelector'
  /**
   * mode为 selector 或 multiSelector 时，range 有效
   */
  range: Array<string[]> | Array<number[]> | Array<Object[]>
  /**
   * 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
   */
  rangeKey?: string
  /**
   * value 的值表示选择了 range 中的第几个（下标从 0 开始）
   */
  value: number[] | string[] | Object[]
  /**
   * 某一列的值改变时触发 columnchange 事件，event.detail = {column: column, value: value}，column 的值表示改变了第几列（下标从0开始），value 的值表示变更值的下标
   */
  onColumnChange?: BaseEventFunction
}

interface PickerTimeProps extends PickerStandardProps {
  /**
   * 从底部弹起的滚动选择器，现支持五种选择器，通过mode来区分，分别是普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器，默认是普通选择器
   */
  mode: 'time'
  /**
   * value 的值表示选择了 range 中的第几个（下标从 0 开始）
   */
  value: string
  /**
   * 仅当 mode = time|date 时有效，表示有效时间范围的开始，字符串格式为"hh:mm"
   */
  start?: string
  /**
   * 仅当 mode = time|date 时有效，表示有效时间范围的结束，字符串格式为"hh:mm"
   */
  end?: string
}

interface PickerDateProps extends PickerStandardProps {
  /**
   * 从底部弹起的滚动选择器，现支持五种选择器，通过mode来区分，分别是普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器，默认是普通选择器
   */
  mode: 'date'
  /**
   * value 的值表示选择了 range 中的第几个（下标从 0 开始）
   */
  value: string
  /**
   * 仅当 mode = time|date 时有效，表示有效时间范围的开始，字符串格式为"hh:mm"
   */
  start?: string
  /**
   * 仅当 mode = time|date 时有效，表示有效时间范围的结束，字符串格式为"hh:mm"
   */
  end?: string
  /**
   * 仅当 mode = date 时有效，有效值 year,month,day，表示选择器的粒度
   *
   * 默认值 `day`
   */
  fields?: 'year' | 'month' | 'day'
}

interface PickerRegionProps extends PickerStandardProps {
  /**
   * 从底部弹起的滚动选择器，现支持五种选择器，通过mode来区分，分别是普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器，默认是普通选择器
   */
  mode: 'region'
  /**
   * value 的值表示选择了 range 中的第几个（下标从 0 开始）
   */
  value: string[]
  /**
   * 仅当 mode = region 时有效，可为每一列的顶部添加一个自定义的项
   */
  customItem: string
}

declare const Picker: ComponentType<
  | PickerSelectorProps
  | PickerMultiSelectorProps
  | PickerTimeProps
  | PickerDateProps
  | PickerRegionProps
>

export { Picker }
