import type { TaroAny, TaroElement } from '@tarojs/runtime'

class FlexManager {
  static flexOptions (node: TaroElement): FlexOptions {
    const hmStyle = node.hmStyle

    let flexDirection = hmStyle.flexDirection
    if (!flexDirection && flexDirection !== 0) {
      flexDirection = hmStyle.display === 'flex' ? FlexDirection.Row : FlexDirection.Column
    }

    return {
      direction: flexDirection,
      justifyContent: hmStyle.justifyContent,
      alignItems: hmStyle.alignItems,
      wrap: hmStyle.flexWrap,
      alignContent: hmStyle.alignContent,
    }
  }
}

export { FlexManager }
