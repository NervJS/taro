
import { AttributeManager } from './AttributeManager'
import { FlexManager } from './FlexManager'

import type { TaroElement } from '@tarojs/runtime'

export function bindInstanceToNode (node: TaroElement, instance: object) {
  if (!node) return
  
  // @ts-ignore
  node.instance = instance
}

export function getNormalAttributes (node: TaroElement) {
  const { _st } = node
  return {
    flexSize: FlexManager.flexSize(_st),
    alignSelf: ItemAlign.Auto,
    size: {
      width: AttributeManager.getNodeStyle(_st, 'width'),
      height: AttributeManager.getNodeHeight(_st)
    },
    margin: AttributeManager.getNodeMarginOrPaddingData(_st, 'margin'),
    padding: AttributeManager.getNodeMarginOrPaddingData(_st, 'padding'),
    linearGradient: AttributeManager.getNodeLinearGradient(_st),
    zIndex: AttributeManager.getNodeStyle(_st, 'zIndex'),
    borderRadius: AttributeManager.getNodeStyle(_st, 'borderRadius'),
    opacity: AttributeManager.getNodeStyle(_st, 'opacity'),
    backgroundColor: AttributeManager.getNodeBackGroundData(_st, 'backgroundColor'),
    backgroundImage: AttributeManager.getNodeBackGroundData(_st, 'backgroundImage'),
    backgroundImageSize: { width: '100%', height: '100%' }
    // Todo: 尚未完成
    // backgroundImageSize: {
    //   width: AttributeManager.getNodeStyle(_st, 'backgroundSize'),
    //   height: AttributeManager.getNodeStyle(_st, 'backgroundSize'),
    // },
  }
}

export const parseStyles = (styles = ''): { [key: string]: string } => {
  return styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => [
    style.split(':')[0].trim().replace(/-./g, c => c.substring(1).toUpperCase()),
    style.split(':')[1].trim()
    ])
    .reduce((styleObj, style) => ({
      ...styleObj,
      [style[0]]: style[1],
    }), {})
}
