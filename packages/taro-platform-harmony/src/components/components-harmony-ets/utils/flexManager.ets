import type { TaroElement } from '@tarojs/runtime'
import { isUndefined } from '@tarojs/shared'

interface IFlexOptions {
  direction: FlexDirection,
  justifyContent: FlexAlign,
  alignItems: VerticalAlign | HorizontalAlign,
  // Row 和 Column 不支持下面两个属性
  // wrap: FlexWrap,
  // alignContent: FlexAlignContent
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

  static flexOptions (node: TaroElement): IFlexOptions {
    const hmStyle = node.hmStyle || {}
    const isFlex = FlexManager.isFlexNode(node)
    const justifyContent: FlexAlign = isFlex ? (isUndefined(hmStyle.justifyContent) ? FlexAlign.Start : hmStyle.justifyContent) : FlexAlign.Start

    let flexDirection = hmStyle.flexDirection
    if (!flexDirection && flexDirection !== 0) {
      flexDirection = hmStyle.display === 'flex' ? FlexDirection.Row : FlexDirection.Column
    }

    const alignItems = isFlex ? FlexManager.convertFlexAlignItemsToColumnOrRow(flexDirection, hmStyle.alignItems) : HorizontalAlign.Start

    return {
      alignItems,
      justifyContent,
      direction: flexDirection,
    }
  }
}

export { FlexManager }
