import { Component, ComponentType, CSSProperties, ReactNode } from 'react'
import { StandardProps, BaseEventOrigFunction } from '../../types/common'
import { ScrollViewProps } from '../../types/ScrollView'

interface VirtualListProps extends StandardProps {
  /** 列表的高度。 */
  height: string | number
  /** 列表的宽度。 */
  width: string | number
  /** 列表的长度 */
  itemCount: number
  /** 渲染数据 */
  itemData: any[]
  /** 列表单项的大小，垂直滚动时为高度，水平滚动时为宽度。 */
  itemSize: number
  /** 解开高度列表单项大小限制，默认值使用: itemSize (请注意，初始高度与实际高度差异过大会导致隐患)。 */
  unlimitedSize?: boolean
  /** 布局方式，默认采用 "absolute" */
  position?: 'absolute' | 'relative'
  /** 初始滚动偏移值，水平滚动影响 scrollLeft，垂直滚动影响 scrollTop。 */
  initialScrollOffset?: number
  /** 列表内部容器组件类型，默认值为 View。 */
  innerElementType?: ComponentType
  /** 底部区域 */
  renderBottom?: ReactNode
  /** 滚动方向。vertical 为垂直滚动，horizontal 为平行滚动。默认为 vertical。 */
  layout?: 'vertical' | 'horizontal'
  /** 列表滚动时调用函数 */
  onScroll?: (event: VirtualListEvent<VirtualListProps.onScrollDetail>) => void
  /** 调用平台原生的滚动监听函数。 */
  onScrollNative?: BaseEventOrigFunction<ScrollViewProps.onScrollDetail>
  /** 在可视区域之外渲染的列表单项数量，值设置得越高，快速滚动时出现白屏的概率就越小，相应地，每次滚动的性能会变得越差。 */
  overscanCount?: number
  /** 是否注入 isScrolling 属性到 children 组件。这个参数一般用于实现滚动骨架屏（或其它 placeholder） 时比较有用。 */
  useIsScrolling?: boolean
  children?: ComponentType<{
    /** 组件 ID */
    id: string
    /** 单项的样式，样式必须传入组件的 style 中 */
    style?: CSSProperties
    /** 组件渲染的数据 */
    data: any
    /** 组件渲染数据的索引 */
    index: number
    /** 组件是否正在滚动，当 useIsScrolling 值为 true 时返回布尔值，否则返回 undefined */
    isScrolling?: boolean
  }>
}

declare namespace VirtualListProps {
  // eslint-disable-next-line @typescript-eslint/class-name-casing
  interface onScrollDetail {
    clientWidth: number
    clientHeight: number
  }
}

interface VirtualListEvent<T> {
  /** 滚动方向，可能值为 forward 往前， backward 往后。 */
  scrollDirection: 'forward' | 'backward'
  /** 滚动距离 */
  scrollOffset: number
  /** 当滚动是由 scrollTo() 或 scrollToItem() 调用时返回 true，否则返回 false */
  scrollUpdateWasRequested: boolean
  /** 当前只有 React 支持 */
  detail?: {
    scrollLeft: number
    scrollTop: number
    scrollHeight: number
    scrollWidth: number
    clientWidth: number
    clientHeight: number
  }
}

/**
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, qq, jd, h5
 * @example
 * ```tsx
 * import VirtualList from `@tarojs/components/virtual-list`
 *
 * function buildData (offset = 0) {
 *   return Array(100).fill(0).map((_, i) => i + offset);
 * }
 *
 * const Row = React.memo(({ id, index, style, data }) => {
 *   return (
 *     <View id={id} className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
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
 *         itemData={data} // 渲染列表的数据
 *         itemCount={dataLen} // 渲染列表的长度
 *         itemSize={100} // 列表单项的高度
 *       >
 *         {Row} // 列表单项组件，这里只能传入一个组件
 *       </VirtualList>
 *     );
 *   }
 * }
 * ```
 * @see https://taro-docs.jd.com/taro/docs/virtual-list/
 */
declare class VirtualList extends Component<VirtualListProps> {}

export = VirtualList
