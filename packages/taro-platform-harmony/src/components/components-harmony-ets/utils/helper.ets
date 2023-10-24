
import { AttributeManager } from './AttributeManager'
import { FlexManager } from './FlexManager'

import type { TaroElement } from '@tarojs/runtime'
import type { Func } from '@tarojs/runtime/dist/runtime.esm'

export function bindInstanceToNode (node: TaroElement, instance: object) {
  if (!node) return

  // @ts-ignore
  node.instance = instance
}

// 动画绑定
export function bindAnimation (node: TaroElement, animationCb: (val: Record<string, any>) => void) {
  if (node._attrs.hasOwnProperty('animation')) {
    node._animationCb = async (animation) => {
      if (animation) {
        for (let i = 0; i < animation.actions.length; i++) {
          const anim = animation.actions[i]
          // 动画队列
          await new Promise(resolve => {
            let timingFunction = anim.timingFunction
            const animateParams = {
              duration: anim.duration,
              delay: anim.delay,
              tempo: 1,
              playMode: PlayMode.Normal,
              iterations: 1,
              onFinish: resolve
            }
            if (timingFunction === 'step-start') {
              animateParams.tempo = 0
            } else if (timingFunction === 'step-end') {
              animateParams.tempo = 0
              animateParams.delay = anim.duration + anim.delay
              animateParams.duration = 0
            }
            animateParams.curve = Curve[convertToCamelCase(timingFunction)] || Curve.EaseInOut
            animateTo(animateParams, () => {
              const transformOrigin = anim.transformOrigin
              if (transformOrigin) {
                const splitOrigin = transformOrigin.split(' ')
                Object.keys(anim.rule).forEach(key => {
                  if (['scale', 'rotate'].includes(key)) {
                    Object.assign(anim.rule[key], {
                      centerX: splitOrigin[0],
                      centerY: splitOrigin[1],
                    })
                  }
                })
              }
              animationCb(anim.rule)
            })
          })
        }
      }
    }
  }
}

export function getNormalAttributes (node: TaroElement, overwriteStyle?: Record<string, any>) {
  const { _st, _attrs } = node
  const transformData = AttributeManager.getTransform(_st)
  const normalAttributes = {
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
    rotate: transformData.rotate,
    translate: transformData.translate,
    scale: transformData.scale,
    transform: transformData.transform
  }
  // 处理覆盖属性：如动画的覆盖
  if (overwriteStyle) {
    if (overwriteStyle.size) {
      // 合并尺寸
      overwriteStyle.size = Object.assign({}, normalAttributes.size, overwriteStyle.size)
    }
    Object.assign(normalAttributes, overwriteStyle)
  }
  return normalAttributes
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

export function getNodeAreaChange (callback: Function, component) {
  const node = component?.node

  if (!node) return null

  if (component.isAreaChangeTap) {
    return (_: Area, areaResult: Area) => {
      if (!component.isAreaChangeTap) return

      callback.call(component, areaResult)

      component?.node?.onAreaChange?.(areaResult)
    }
  }

  return null
}

export function shouldBindEvent (cb: Func, node: TaroElement, eventNames: string[], disabled = false) {
  if (!node || node._attrs?.disabled || disabled) return null

  const listeners = Object.keys(node.__listeners || {})
  if (listeners.every(e => !eventNames.includes(e))) return null

  return cb
}

function convertToCamelCase(str) {
  return str.replace(/-(.)/g, (_, char) => char.toUpperCase()).replace(/^\w/, firstChar => firstChar.toUpperCase());
}