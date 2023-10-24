
import { AttributeManager } from './AttributeManager'
import { FlexManager } from './FlexManager'

import type { TaroElement } from '@tarojs/runtime'
import type { Func } from '@tarojs/runtime/dist/runtime.esm'

export function bindInstanceToNode (node: TaroElement, instance: object) {
  if (!node) return

  // @ts-ignore
  node.instance = instance
}

export function getNormalAttributes (node: TaroElement) {
  const { _st, _attrs } = node
  return {
    flexSize: FlexManager.flexSize(_st),
    alignSelf: ItemAlign.Auto,
    size: {
      width: AttributeManager.getNodeStyle(_st, 'width'),
      height: AttributeManager.getNodeStyle(_st, 'height')
    },
    focus: AttributeManager.getNodeStyle(_attrs, 'focus', false),
    margin: AttributeManager.getNodeStyle(_st, 'margin'),
    padding: AttributeManager.getNodeStyle(_st, 'padding'),
    linearGradient: AttributeManager.getNodeLinearGradient(_st),
    zIndex: Number(AttributeManager.getNodeStyle(_st, 'zIndex')) || null,
    border: AttributeManager.getNodeBorderData(_st),
    borderRadius: AttributeManager.getNodeStyle(_st, 'borderRadius'),
    opacity: AttributeManager.getNodeStyle(_st, 'opacity'),
    backgroundColor: AttributeManager.getNodeBackGroundData( _st, 'backgroundColor'),
    backgroundImage: parseBackground('backgroundImage', AttributeManager.getNodeBackGroundData(_st, 'backgroundImage')),
    backgroundImageSize: parseBackground('backgroundSize', AttributeManager.getNodeBackGroundData(_st, 'backgroundSize')),
    constraintSize: {
      minWidth: AttributeManager.getNodeStyle(_st, 'minWidth'),
      maxWidth: AttributeManager.getNodeStyle(_st, 'maxWidth'),
      minHeight: AttributeManager.getNodeStyle(_st, 'minHeight'),
      maxHeight: AttributeManager.getNodeStyle(_st, 'maxHeight'),
    },
    animation: AttributeManager.getNodeAnimationData(_st),
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


const IMAGE_URL_REGEX = /url\(['"]?([^'"]+)['"]?\)/;
const parseBackground = (name: string, value: string) => {
  switch (name) {
    case 'backgroundImage': {
      if (!value) return
      // 兼容url()
      const matchs = value.match(IMAGE_URL_REGEX)
      if (matchs) {
        return matchs[1]
      }
      return value
    }
    case 'backgroundSize': {
      if (!value) return ImageSize.Auto
      const lower = value.toLowerCase()
      if (lower === 'cover') return ImageSize.Cover
      else if (lower === 'contain') return ImageSize.Contain
      else if (lower === 'auto') return ImageSize.Auto
      else {
        const [width, height] = value.split(' ')
        const res = {
          width
        }
        if (height) {
          res['height'] = height
        }
        return res
      }
    }
  }
}

export function convertVP2PX (value: number) {
  return Math.ceil(value / 384 * 750)
}

export function shouldBindEvent (cb: Func, node: TaroElement, eventNames: string[], disabled = false) {
  if (!node || node._attrs?.disabled || disabled) return null

  const listeners = Object.keys(node.__listeners || {})
  if (listeners.every(e => !eventNames.includes(e))) return null

  return cb
}
