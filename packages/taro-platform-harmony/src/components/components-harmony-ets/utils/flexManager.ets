import { AttributeManager } from './AttributeManager' 
import { w3cToHarmonyStyle } from './dynamicConvert'

import type { TaroElement } from '@tarojs/runtime'

class FlexManager {
  static flexOptions (node: TaroElement): FlexOptions {
    const { _st = {} } = node

    let flexOptions = AttributeManager.getStyleAfterConvert(_st, 'flexOptions')
    if (flexOptions) {
      const isDirectionExist = flexOptions.direction !== undefined
      if (!isDirectionExist) {
        const isFlexDisplay = _st.display === 'flex'

        flexOptions.direction = isFlexDisplay ? FlexDirection.Row : FlexDirection.Column
      }
    } else {
      flexOptions = {
        direction: FlexDirection.Column
      }
    }

    if (_st.flexDirection !== undefined) {
      w3cToHarmonyStyle(flexOptions, 'flexDirection', _st.flexDirection)
    }
    if (_st.justifyContent !== undefined) {
      w3cToHarmonyStyle(flexOptions, 'justifyContent', _st.justifyContent)
    }
    if (_st.alignItems !== undefined) {
      w3cToHarmonyStyle(flexOptions, 'alignItems', _st.alignItems)
    }

    // TODO:
    // if (_st.wrap !== undefined) {
    //   w3cToHarmonyStyle(flexOptions, 'wrap', _st.wrap)
    // }
    // if (_st.alignContent !== undefined) {
    //   w3cToHarmonyStyle(flexOptions, 'alignContent', _st.alignContent)
    // }

    return flexOptions
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

  static flexDirection (style: Record<string, string | number> = {}): FlexDirection {
    const value = style.flexDirection
    switch (value) {
      case 'row':
        return FlexDirection.Row
      case 'row-reverse':
        return FlexDirection.RowReverse
      case 'column-reverse':
        return FlexDirection.ColumnReverse
      default:
        return FlexDirection.Column
    }
  }

  static justifyContent (style: Record<string, string | number> = {}): FlexAlign {
    const value = style.justifyContent
    return FlexManager.flexAlign(value)
  }

  static alignItems (style: Record<string, string | number> = {}): ItemAlign {
    const value = style.alignItems
    return FlexManager.itemAlign(value)
  }

  static alignSelf (style: Record<string, string | number> = {}): ItemAlign | undefined {
    const value = style.alignSelf
    return FlexManager.itemAlign(value)
  }

  static flexWrap (style: Record<string, string | number> = {}): FlexWrap {
    const value = style.flexWrap
    return value === 'wrap' ? FlexWrap.Wrap : FlexWrap.NoWrap
  }

  static alignContent (style: Record<string, string | number> = {}): FlexAlign | undefined {
    if (style.flexWrap !== 'wrap') return undefined
    const value = style.alignContent
    return FlexManager.flexAlign(value)
  }

  static flexSize (style: Record<string, string | number> = {}): [number, number, number | string] {
    const { flex, flexGrow = 0, flexShrink = 0, flexBasis = 'auto' } = style
    let res: [number, number, number | string] = [Number(flexGrow), Number(flexShrink), flexBasis]

    if (typeof flex === 'number') {
      res = [flex, 1, 0]
    } else if (flex === 'auto') {
      res = [1, 1, 'auto']
    } else if (flex === 'none') {
      res = [0, 0, 'auto']
    } else if (typeof flex === 'string') {
      const FlexList = flex.replace(/ +/g, ' ').split(' ')
      FlexList.forEach((item, index) => {
        res[index] = index < 2 ? Number(item) : item
      })
    }
    return res
  }
}

export { FlexManager }
