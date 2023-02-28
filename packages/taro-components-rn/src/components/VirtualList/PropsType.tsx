import React, { ComponentType } from 'react'
import { ListRenderItemInfo, StyleProp, ViewStyle, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

export interface ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VirtualListProps {
  /** 列表的高度。 */
  height: string | number;
  /** 列表的宽度。 */
  width: string | number;
  /** 列表的长度 */
  itemCount: number;
  /** 渲染数据 */
  itemData: any[];
  /** 列表单项的大小，垂直滚动时为高度，水平滚动时为宽度。 */
  itemSize: number;
  /** 初始滚动偏移值，水平滚动影响 scrollLeft，垂直滚动影响 scrollTop。 */
  initialScrollOffset?: number;
  /** 列表内部容器组件类型，默认值为 View。 */
  innerElementType?: ComponentType;
  /** 滚动方向。vertical 为垂直滚动，horizontal 为平行滚动。默认为 vertical。 */
  layout?: 'vertical' | 'horizontal';
  /** 列表滚动时调用函数 */
  onScroll?: (event: VirtualListEvent) => void;
  /** 调用平台原生的滚动监听函数。 */
  onScrollNative?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** 在可视区域之外渲染的列表单项数量，值设置得越高，快速滚动时出现白屏的概率就越小，相应地，每次滚动的性能会变得越差。 */
  overscanCount?: number;
  /** 是否注入 isScrolling 属性到 children 组件。这个参数一般用于实现滚动骨架屏（或其它 placeholder） 时比较有用。 */
  useIsScrolling?: boolean;
  // 兼容 H5 虚拟列表组件
  item: ComponentType<{
    id?: string;
    style?: React.CSSProperties;
    data: any;
    index: number;
    isScrolling?: boolean;
  } & ListRenderItemInfo<any>>;
  children: ComponentType<{
    /** 单项的样式，样式必须传入组件的 style 中 */
    style?: Record<string, unknown>;
    /** 组件渲染的数据 */
    data: any;
    /** 单个列表组件数据 */
    item: any;
    /** 组件渲染数据的索引 */
    index: number;
    /** 组件是否正在滚动，当 useIsScrolling 值为 true 时返回布尔值，否则返回 undefined */
    // isScrolling?: boolean
  } & ListRenderItemInfo<any>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface VirtualListEvent {
  /** 滚动方向，可能值为 forward 往前， backward 往后。 */
  scrollDirection: 'forward' | 'backward';
  /** 滚动距离 */
  scrollOffset: number;
  /** 当滚动是由 scrollTo() 或 scrollToItem() 调用时返回 true，否则返回 false */
  scrollUpdateWasRequested: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace VirtualListProps {
  interface onScrollDetail {
    clientWidth: number;
    clientHeight: number;
  }
}
