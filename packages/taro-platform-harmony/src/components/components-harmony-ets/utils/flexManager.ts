import { type TaroElement } from '@tarojs/runtime'
import { capitalize, toCamelCase } from '@tarojs/shared'

function convertFlexValue (value: any, defaultValue: string): string {
  return typeof value === 'string' ? capitalize(toCamelCase(value.replace(/^flex-/, ''))) : defaultValue
}

class FlexManager {
  static flexDirection (node: TaroElement): FlexDirection {
    const value = node._st.flexDirection
    const direction = convertFlexValue(value, 'Column')
    return FlexDirection[direction]
  }

  static justifyContent (node: TaroElement): FlexAlign {
    const value = node._st.justifyContent
    const align = convertFlexValue(value, 'Start').split('-').map(item => capitalize(item)).join('')
    return FlexAlign[align]
  }

  static alignItems (node: TaroElement): ItemAlign {
    const value = node._st.alignItems
    const align = convertFlexValue(value, 'Stretch')
    return ItemAlign[align]
  }

  static getAlignSelf (node: TaroElement): ItemAlign | undefined {
    const value = node._st.alignSelf
    if (value === undefined) {
      return undefined
    }
    const align = convertFlexValue(value, 'Start')
    return ItemAlign[align]
  }

  static flexWrap (node: TaroElement): FlexWrap {
    const value = node._st.flexWrap
    if (value === 'wrap') {
      return FlexWrap.Wrap
    } else {
      return FlexWrap.NoWrap
    }
  }

  static alignContent (node: TaroElement): FlexAlign {
    const value = node._st.alignContent
    const align = convertFlexValue(value, 'Start')
    return FlexAlign[align]
  }

  static flexSize (node: TaroElement): [number, number, number | string] {
    const { flex, flexGrow = 0, flexShrink = 0, flexBasis = 'auto' } = node._st
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
