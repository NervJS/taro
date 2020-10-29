import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

/** 滚动选择器子项
 * 仅可放置于 `<PickerView />` 中，其孩子节点的高度会自动设置成与 picker-view 的选中框的高度一致
 * @classification forms
 * @supported weapp, swan, alipay, tt
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/picker-view-column.html
 */
declare const PickerViewColumn: ComponentType<StandardProps>

export { PickerViewColumn }
