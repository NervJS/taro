import type { TaroElement, HarmonyStyle } from '@tarojs/runtime'
import { isUndefined } from '@tarojs/shared'
import { getNormalAttributes } from './styles'

interface IFlexOptions {
  direction: FlexDirection,
  justifyContent: FlexAlign,
  alignItems: ItemAlign,
  wrap?: FlexWrap,
  alignContent?: FlexAlign
}

class FlexManager {
  static isFlexNode (node: TaroElement): boolean {
    return !!node.hmStyle?.display?.includes('flex')
  }

  static convertFlexAlignItemsToColumnOrRow (direction: FlexDirection, alignItems: ItemAlign | undefined): 	VerticalAlign | HorizontalAlign {
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

  static useFlexLayout (node: TaroElement): boolean {
    const hmStyle: HarmonyStyle = getNormalAttributes(node) || {}
    const isReverse = hmStyle.flexDirection && [FlexDirection.RowReverse, FlexDirection.ColumnReverse].indexOf(hmStyle.flexDirection) !== -1;
    const isUnknownAlign = [ItemAlign.Stretch, ItemAlign.Baseline].indexOf(hmStyle.alignItems!) !== -1;
    return !isUndefined(hmStyle.flexWrap) || isReverse || isUnknownAlign;
  }

  static flexOptions (node: TaroElement): IFlexOptions {
    const hmStyle: HarmonyStyle = getNormalAttributes(node) || {}
    const isFlex = FlexManager.isFlexNode(node)
    let flexDirection = hmStyle.flexDirection
    if (!flexDirection && flexDirection !== 0) {
      flexDirection = hmStyle.display === 'flex' ? FlexDirection.Row : FlexDirection.Column
    }

    return {
      alignItems: isFlex ? (isUndefined(hmStyle.alignItems) ? ItemAlign.Start : hmStyle.alignItems) : ItemAlign.Start,
      justifyContent: isFlex ? (isUndefined(hmStyle.justifyContent) ? FlexAlign.Start : hmStyle.justifyContent) : FlexAlign.Start,
      direction: flexDirection,
      wrap: isFlex ? hmStyle.flexWrap: FlexWrap.NoWrap,
      alignContent: isFlex ? hmStyle.alignContent: FlexAlign.Start
    }
  }

  static direction (node: TaroElement): FlexDirection {
    const hmStyle: HarmonyStyle = getNormalAttributes(node)
    let flexDirection = hmStyle.flexDirection
    if (!flexDirection && flexDirection !== 0) {
      flexDirection = hmStyle.display === 'flex' ? FlexDirection.Row : FlexDirection.Column
    }
    return flexDirection
  }

  static alignItems<T> (node: TaroElement): T {
    const hmStyle: HarmonyStyle = getNormalAttributes(node)
    const isFlex = FlexManager.isFlexNode(node)
    let flexDirection = hmStyle.flexDirection
    if (!flexDirection && flexDirection !== 0) {
      flexDirection = hmStyle.display === 'flex' ? FlexDirection.Row : FlexDirection.Column
    }
    return (isFlex ? FlexManager.convertFlexAlignItemsToColumnOrRow(flexDirection, hmStyle.alignItems) : HorizontalAlign.Start) as T
  }

  static justifyContent (node: TaroElement): FlexAlign {
    const hmStyle: HarmonyStyle = getNormalAttributes(node)
    const isFlex = FlexManager.isFlexNode(node)
    return isFlex ? (isUndefined(hmStyle.justifyContent) ? FlexAlign.Start : hmStyle.justifyContent) : FlexAlign.Start
  }
}

export { FlexManager }
