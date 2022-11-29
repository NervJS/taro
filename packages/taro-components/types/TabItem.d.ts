import { ComponentType } from 'react'
import { StandardProps } from './common'
interface TabItemProps extends StandardProps {
  /** tab-item 内显示的文字
   * @supported swan
   * @default 无
   */
  label?: string

  /** tab-item 对应的 name 值
   * @supported swan
   * @default 无
   */
  name?: string

  /** 徽标类型 badge-type 分为圆点“dot”和文本“text”，不设置 badge-type 则不显示徽标
   * @supported swan
   * @default 无
   */
  badgeType?: string

  /** badge-type 为 text 的时候，徽标内的数字，为空时badge-type="text"不生效
   * @supported swan
   * @default 无
   */
  badgeText?: string
}

/** 标签栏子项
 * @classification navig
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/tab-item/
 */
declare const TabItem: ComponentType<TabItemProps>
export { TabItem, TabItemProps }
