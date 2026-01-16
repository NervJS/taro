import type { ComponentType, PropsWithChildren } from 'react'
import type { ListBuilderProps } from './ListBuilder'
import type { ScrollViewProps } from './ScrollView'
import type { StandardProps } from './common'

interface ListProps
  extends Pick<
      ScrollViewProps,
      | 'scrollX'
      | 'scrollY'
      | 'scrollTop'
      | 'scrollIntoView'
      | 'enableBackToTop'
      | 'showScrollbar'
      | 'onScroll'
      | 'onScrollStart'
      | 'onScrollEnd'
      | 'onScrollToUpper'
      | 'onScrollToLower'
      | 'cacheExtent'
    >,
    Omit<ListBuilderProps, keyof StandardProps>,
    Pick<StandardProps, 'id' | 'className' | 'style' | 'compileMode' | 'key'> {
  /** 距顶部/左边多远时（单位px），触发 scrolltoupper 事件
   * @default 50
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  upperThresholdCount?: number
  /** 距底部/右边多远时（单位px），触发 scrolltolower 事件
   * @default 50
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  lowerThresholdCount?: number
}

declare const List: ComponentType<PropsWithChildren<ListProps>>

export { List, ListProps }
