import type { BaseEventOrig, BaseEventOrigFunction, ScrollViewProps, StandardProps } from '@tarojs/components'
import type { Component, ComponentType, CSSProperties, ReactNode } from 'react'

interface VirtualListProps<T = any> extends Omit<StandardProps, 'children'> {
  /** 列表的高度。 */
  height: string | number
  /** 列表的宽度。 */
  width: string | number
  /** 子组件 */
  item: ComponentType<{
    /** 组件 ID */
    id: string
    /** 组件渲染的数据 */
    data: T[]
    /** 组件渲染数据的索引 */
    index: number
    /** 组件是否正在滚动，当 useIsScrolling 值为 true 时返回布尔值，否则返回 undefined */
    isScrolling?: boolean
  }>
  /** 列表的长度 */
  itemCount: number
  /** 渲染数据 */
  itemData: T[]
  /** 列表单项的大小，垂直滚动时为高度，水平滚动时为宽度。
   *
   * > Note:
   * >  - unlimitedSize 模式下如果传入函数，只会调用一次用于设置初始值
   * >  - 非 unlimitedSize 模式下如果传入函数，为避免性能问题，每个节点只会调用一次用于设置初始值
   */
  itemSize: number | ((index?: number, itemData?: T[]) => number)
  /** 解开高度列表单项大小限制，默认值使用: itemSize。
   *
   * > Note: 通过 itemSize 设置的初始高度与子节点实际高度差异过大会导致隐患，建议将单页大小设置接近于现实高度，在该模式下可以提升用户体验。
   * @default false
   */
  unlimitedSize?: boolean
  /** 布局方式
   * @default "absolute"
   */
  position?: 'absolute' | 'relative' | 'brick'
  /** 滚动方向。vertical 为垂直滚动，horizontal 为平行滚动。
   * @default "vertical"
   */
  layout?: 'vertical' | 'horizontal'
  /** 初始滚动偏移值，水平滚动影响 scrollLeft，垂直滚动影响 scrollTop。 */
  initialScrollOffset?: number
  /** 在可视区域之外渲染的列表单项数量，值设置得越高，快速滚动时出现白屏的概率就越小，相应地，每次滚动的性能会变得越差。 */
  overscanCount?: number
  /** 上下滚动预占位节点 */
  placeholderCount?: number
  /** 触顶事件触发时距页面顶部距离
   * @default 50
   */
  upperThreshold?: number
  /** 触底事件触发时距页面底部距离
   * @default 50
   */
  lowerThreshold?: number
  /** 是否注入 isScrolling 属性到 item 组件。这个参数一般用于实现滚动骨架屏（或其它 placeholder） 时比较有用。 */
  useIsScrolling?: boolean
  /** 通过 ScrollViewContext 优化组件滚动性能
   * @default false
   * @note 部分平台不支持，使用时请注意甄别
   */
  enhanced?: boolean
  /** 列表外部容器组件类型。
   * @default ScrollView
   */
  outerElementType?: ComponentType | string
  /** 列表内部容器组件类型。
   * @default View
   */
  innerElementType?: ComponentType | string
  /** 列表子节点容器组件类型。
   * @default View
   */
  itemElementType?: ComponentType | string
  /** 顶部区域 */
  renderTop?: ReactNode
  /** 底部区域 */
  renderBottom?: ReactNode
  /** 列表滚动时调用函数 */
  onScroll?: (event: VirtualListProps.IVirtualListEvent<VirtualListProps.IVirtualListEventDetail>) => void
  /** 调用平台原生的滚动监听函数。 */
  onScrollNative?: BaseEventOrigFunction<ScrollViewProps.onScrollDetail>
  /** 触顶事件 */
  onScrollToUpper?: () => void
  /** 触底事件 */
  onScrollToLower?: () => void
  style?: CSSProperties
}

declare namespace VirtualListProps {
  interface IVirtualListEventDetail extends ScrollViewProps.onScrollDetail {
    scrollLeft: number
    scrollTop: number
    scrollHeight: number
    scrollWidth: number
    clientHeight: number
    clientWidth: number
    diffOffset: number
  }

  interface IVirtualListEvent<T extends ScrollViewProps.onScrollDetail = ScrollViewProps.onScrollDetail> extends BaseEventOrig {
    /** 滚动方向，可能值为 forward 往前， backward 往后。 */
    scrollDirection: 'forward' | 'backward'
    /** 滚动距离 */
    scrollOffset: number
    /** 当滚动是由 scrollTo() 或 scrollToItem() 调用时返回 true，否则返回 false */
    scrollUpdateWasRequested: boolean
    /** 滚动信息 */
    detail: T
  }
}

/** 虚拟列表
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, qq, jd, h5
 * @example_react
 * ```tsx
 * import VirtualList from `@tarojs/components/virtual-list`
 *
 * function buildData (offset = 0) {
 *   return Array(100).fill(0).map((_, i) => i + offset);
 * }
 *
 * const Row = React.memo(({ id, index, data }) => {
 *   return (
 *     <View id={id} className={index % 2 ? 'ListItemOdd' : 'ListItemEven'}>
 *       Row {index}
 *     </View>
 *   );
 * })
 *
 * export default class Index extends Component {
 *   state = {
 *     data: buildData(0),
 *   }
 *
 *   render() {
 *     const { data } = this.state
 *     const dataLen = data.length
 *     return (
 *       <VirtualList
 *         height={500} // 列表的高度
 *         width='100%' // 列表的宽度
 *         item={Row} // 列表单项组件，这里只能传入一个组件
 *         itemData={data} // 渲染列表的数据
 *         itemCount={dataLen} // 渲染列表的长度
 *         itemSize={100} // 列表单项的高度
 *       />
 *     );
 *   }
 * }
 * ```
 * @example_vue
 * ```js
 * // app.js 入口文件
 * import Vue from 'vue'
 * import VirtualList from '@tarojs/components/virtual-list'
 *
 * Vue.use(VirtualList)
 * ```
 * ```js
 * <! –– row.vue 单项组件 ––>
 * <template>
 *   <view
 *     :class="index % 2 ? 'ListItemOdd' : 'ListItemEven'"
 *   >
 *     Row {{ index }} : {{ data[index] }}
 *   </view>
 * </template>
 *
 * <script>
 * export default {
 *   props: ['index', 'data']
 * }
 * </script>
 * ```
 * ```js
 * <! –– page.vue 页面组件 ––>
 * <template>
 *   <virtual-list
 *     :height="500"
 *     :item-data="list"
 *     :item-count="list.length"
 *     :item-size="100"
 *     :item="Row"
 *     width="100%"
 *   />
 * </template>
 *
 * <script>
 * import Row from './row.vue'
 * import { markRaw } from 'vue'
 *
 * function buildData (offset = 0) {
 *   return Array(100).fill(0).map((_, i) => i + offset)
 * }
 *
 * export default {
 *   data() {
 *     return {
 *       Row: markRaw(Row),
 *       list: buildData(0)
 *     }
 *   },
 * }
 * </script>
 * ```
 * @see https://taro-docs.jd.com/docs/virtual-list
 */
declare class VirtualListComponent extends Component<VirtualListProps> {
  /**
   * 滚动到指定的地点。
   */
  public scrollTo(scrollOffset: number, enhanced?: boolean): void

  /** 滚动到指定的条目。
   * @param index 指定条目的索引。
   * @param align 滚动到指定条目时，指定条目的位置。默认值为 auto。
   *
   * - start：指定条目在可视区域的顶部。
   * - end：指定条目在可视区域的底部。
   * - center：指定条目在可视区域的中间。
   * - auto：尽可能滚动距离最小保证条目在可视区域中，如果已经在可视区域，就不滚动。
   * - smart：条目如果已经在可视区域，就不滚动；如果有部分在可视区域，尽可能滚动距离最小保证条目在可视区域中；如果条目完全不在可视区域，那就滚动到条目在可视区域居中显示。
   */
  public scrollToItem(index: number, align: 'start' | 'end' | 'center' | 'auto' | 'smart', enhanced?: boolean): void
}

declare type VirtualList = VirtualListComponent
const VirtualList: typeof VirtualListComponent = (process.env.FRAMEWORK === 'vue' || process.env.FRAMEWORK === 'vue3')
  ? require('./vue').default
  : require('./react').default

export { VirtualList, VirtualListProps }
export default VirtualList
