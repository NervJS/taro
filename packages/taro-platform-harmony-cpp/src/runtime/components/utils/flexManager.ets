import { isUndefined } from '@tarojs/shared'

import { getNormalAttributes } from './styles'

import type { TaroAny, TaroElement, HarmonyStyle } from '@tarojs/runtime'

class FlexManager {
  static isFlexNode (node: TaroElement): boolean {
    return !!node.hmStyle?.display?.includes('flex')
  }

  static convertFlexAlignItemsToColumnOrRow (direction: FlexDirection, alignItems?: ItemAlign): 	VerticalAlign | HorizontalAlign {
    if (direction === FlexDirection.Column) {
      switch (alignItems) {
        case ItemAlign.Center:
          return HorizontalAlign.Center
        case ItemAlign.End:
          return HorizontalAlign.End
        default:
          return HorizontalAlign.Start
      }
    } else {
      switch (alignItems) {
        case ItemAlign.Center:
          return VerticalAlign.Center
        case ItemAlign.End:
          return VerticalAlign.Bottom
        default:
          return VerticalAlign.Top
      }
    }
  }

  static alignItems<T> (node: TaroElement): T {
    const hmStyle: HarmonyStyle = getNormalAttributes(node)
    let flexDirection: TaroAny = hmStyle.flexDirection
    if (!flexDirection && flexDirection !== 0) {
      flexDirection = hmStyle.display === 'flex' ? FlexDirection.Row : FlexDirection.Column
    }
    return (FlexManager.isFlexNode(node) ? FlexManager.convertFlexAlignItemsToColumnOrRow(flexDirection, hmStyle.alignItems) : HorizontalAlign.Start) as T
  }

  static justifyContent (node: TaroElement): FlexAlign {
    const hmStyle: HarmonyStyle = getNormalAttributes(node)
    return FlexManager.isFlexNode(node) ? (isUndefined(hmStyle.justifyContent) ? FlexAlign.Start : hmStyle.justifyContent!) : FlexAlign.Start
  }
}

export { FlexManager }
