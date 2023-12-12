import type { TaroAny, TaroElement } from '@tarojs/runtime'

class FlexManager {
  static flexOptions (node: TaroElement): FlexOptions {
    const hmStyle = node.hmStyle

    let flexDirection = hmStyle.direction
    if (!flexDirection && flexDirection !== 0) {
      flexDirection = hmStyle.display === 'flex' ? FlexDirection.Row : FlexDirection.Column
    }

    return {
      direction: flexDirection,
      justifyContent: hmStyle.justifyContent,
      alignItems: hmStyle.alignItems
    }
  }

  static flexAlign (value: string | number | undefined): FlexAlign {
    switch (value) {
      case 'flex-end':
        return FlexAlign.End
      case 'center':
        return FlexAlign.Center
      case 'space-between':
        return FlexAlign.SpaceBetween
      case 'space-around':
        return FlexAlign.SpaceAround
      case 'space-evenly':
        return FlexAlign.SpaceEvenly
      default:
        return FlexAlign.Start
    }
  }

  static direction (value: string): FlexDirection {
    switch (value) {
      case 'row': return FlexDirection.Row;
      case 'row-reverse': return FlexDirection.RowReverse;
      case 'column-reverse': return FlexDirection.ColumnReverse;
      default: return FlexDirection.Column;
    }
  }

  static itemAlign (value: string | number | undefined): ItemAlign {
    switch (value) {
      case 'flex-start':
        return ItemAlign.Start
      case 'flex-end':
        return ItemAlign.End
      case 'center':
        return ItemAlign.Center
      case 'stretch':
        return ItemAlign.Stretch
      case 'baseline':
        return ItemAlign.Baseline
      default:
        return ItemAlign.Auto
    }
  }

  static justifyContent (value: string): FlexAlign {
    return FlexManager.flexAlign(value)
  }

  static alignItems (value: string): ItemAlign {
    return FlexManager.itemAlign(value)
  }

  static alignSelf (value: string): ItemAlign {
    return FlexManager.itemAlign(value)
  }

  static flexWrap (value: string): FlexWrap {
    return value === 'wrap' ? FlexWrap.Wrap : FlexWrap.NoWrap
  }

  static alignContent (style: Record<string, string | number> = {}): FlexAlign | undefined {
    if (style.flexWrap !== 'wrap') return undefined
    const value = style.alignContent
    return FlexManager.flexAlign(value)
  }

  static flexSize (style: Record<string, string | number> = {}): [number, number, number | string] {
    const flex = style.flex
    const flexGrow = style.flexGrow || 0
    const flexShrink = style.flexShrink || 0
    const flexBasis = style.flexBasis || 'auto'
    let res: [number, number, number | string] = [Number(flexGrow), Number(flexShrink), flexBasis]

    if (typeof flex === 'number') {
      res = [flex, 1, 0]
    } else if (flex === 'auto') {
      res = [1, 1, 'auto']
    } else if (flex === 'none') {
      res = [0, 0, 'auto']
    } else if (typeof flex === 'string') {
      const FlexList = flex.replace(new RegExp("/\s+/g"), ' ').split(' ')
      FlexList.forEach((item, index) => {
        res[index] = index < 2 ? Number(item) : item
      })
    }
    return res
  }
}

export { FlexManager }
