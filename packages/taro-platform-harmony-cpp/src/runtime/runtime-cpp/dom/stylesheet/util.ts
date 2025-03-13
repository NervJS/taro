import { BorderStyle, FlexAlign, FlexDirection, FlexWrap, ItemAlign } from '../../constant'

export class FlexManager {
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

  static reverseFlexAlign (value: FlexAlign): string {
    switch (value) {
      case FlexAlign.Start:
        return 'flex-start'
      case FlexAlign.End:
        return 'flex-end'
      case FlexAlign.Center:
        return 'center'
      case FlexAlign.SpaceBetween:
        return 'space-between'
      case FlexAlign.SpaceAround:
        return 'space-around'
      case FlexAlign.SpaceEvenly:
        return 'space-evenly'
      default:
        return ''
    }
  }

  static direction (value: string): FlexDirection {
    switch (value) {
      case 'row': return FlexDirection.Row
      case 'row-reverse': return FlexDirection.RowReverse
      case 'column-reverse': return FlexDirection.ColumnReverse
      default: return FlexDirection.Column
    }
  }

  static reverseDirection (value: FlexDirection): string {
    switch (value) {
      case FlexDirection.Row: return 'row'
      case FlexDirection.RowReverse: return 'row-reverse'
      case FlexDirection.Column: return 'column'
      case FlexDirection.ColumnReverse: return 'column-reverse'
      default: return ''
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

  static reverseItemAlign (value: ItemAlign): string {
    switch (value) {
      case ItemAlign.Start:
        return 'flex-start'
      case ItemAlign.End:
        return 'flex-end'
      case ItemAlign.Center:
        return 'center'
      case ItemAlign.Stretch:
        return 'stretch'
      case ItemAlign.Baseline:
        return 'baseline'
      case ItemAlign.Auto:
        return 'auto'
      default:
        return ''
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
    switch (value) {
      case 'nowrap':
        return FlexWrap.NoWrap
      case 'wrap':
        return FlexWrap.Wrap
      case 'wrap-reverse':
        return FlexWrap.WrapReverse
      default:
        return FlexWrap.NoWrap
    }
  }

  static reverseFlexWrap (value: FlexWrap): string {
    switch (value) {
      case FlexWrap.NoWrap:
        return 'nowrap'
      case FlexWrap.Wrap:
        return 'wrap'
      case FlexWrap.WrapReverse:
        return 'wrap-reverse'
      default:
        return 'nowrap'
    }
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
      const FlexList = flex.replace(new RegExp('\\s+'), ' ').split(' ')
      FlexList.forEach((item, index) => {
        res[index] = index < 2 ? Number(item) : item
      })
    }
    return res
  }
}

export class BORDER_STYLE_MAP {
  static solid = BorderStyle.Solid
  static dotted = BorderStyle.Dotted
  static dashed = BorderStyle.Dashed

  static get(type: string): BorderStyle {
    switch (type) {
      case 'dotted': return BorderStyle.Dotted
      case 'dashed': return BorderStyle.Dashed
      default: return BorderStyle.Solid
    }
  }

  static reverse(type: BorderStyle): string {
    switch (type) {
      case BorderStyle.Dotted: return 'dotted'
      case BorderStyle.Dashed: return 'dashed'
      case BorderStyle.Solid: return 'solid'
      default: return ''
    }
  }
}

export function capitalizeFirstLetter (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
