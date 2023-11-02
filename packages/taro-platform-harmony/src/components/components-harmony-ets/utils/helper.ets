import { isUndefined } from '@tarojs/shared'
import { AttributeManager } from './AttributeManager'
import { FlexManager } from './flexManager'
import { w3cToHarmonyStyle } from './dynamicConvert'

import type { TaroElement } from '@tarojs/runtime'
import type { Func } from '@tarojs/runtime/dist/runtime.esm'

export function bindInstanceToNode (node: TaroElement, instance: object) {
  if (!node) return

  // @ts-ignore
  node.instance = instance

  // 触发appear，让node监听到TaroNode已经和ete自定义组件绑定上
  // @ts-ignore
  node.resolveAppear?.()  // #text node节点没有实现该方法
}

export function bindFocus (node: TaroElement) {
  if (!node) return

  node._focusCb = () => {
    focusControl.requestFocus(node._nid) 
  }
}

// 动画绑定
export function bindAnimation (node: TaroElement, animationCb: (val: Record<string, any>) => void) {
  if (!node) return

  if (node._attrs?.hasOwnProperty?.('animation')) {
    node._animationCb = async (animation) => {
      if (animation && animation.actions) {
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

  // const transformData = AttributeManager.getTransform(_st)

  const linearGradient = AttributeManager.getNodeStyle(_st, 'linearGradient')

  const background = AttributeManager.getNodeStyle(_st, 'background')
  const _backgroundImage = background?.image?.[0]
  let backgroundImage, backgroundRepeat
  if (_backgroundImage) {
    backgroundImage = _backgroundImage.src
    backgroundRepeat = _backgroundImage.src
  }
  const backgroundSize = background?.size?.[0]
  const backgroundColor = backgroundImage ? null : background?.color



  const transform = AttributeManager.getNodeStyle(_st, 'transform')
  const transformRotate = transform?.rotate?.[0]
  const transformTranslate = transform?.translate?.[0]
  const transformScale = transform?.scale?.[0]
  const transformTransform = transform?.transform?.[0]

  const normalAttributes = {
    // Flex相关
    flexBasis: AttributeManager.getNodeStyle(_st, 'flexBasis'),
    flexGrow: AttributeManager.getNodeStyle(_st, 'flexGrow'),
    flexShrink: AttributeManager.getNodeStyle(_st, 'flexShrink'),
    alignSelf: AttributeManager.getNodeStyle(_st, 'alignSelf'),
    // 尺寸相关
    width: AttributeManager.getNodeStyle(_st, 'width'),
    height: AttributeManager.getNodeStyle(_st, 'height'),
    constraintSize: AttributeManager.getNodeStyle(_st, 'constraintSize'),
    margin: AttributeManager.getNodeStyle(_st, 'margin'),
    padding: AttributeManager.getNodeStyle(_st, 'padding'),
    // 边框相关
    borderStyle: AttributeManager.getNodeStyle(_st, 'borderStyle'),
    borderWidth: AttributeManager.getNodeStyle(_st, 'borderWidth'),
    borderColor: AttributeManager.getNodeStyle(_st, 'borderColor'),
    borderRadius: AttributeManager.getNodeStyle(_st, 'borderRadius'),
    // 背景相关
    backgroundColor: backgroundColor,
    backgroundImage: backgroundImage,
    backgroundImageSize: backgroundSize,
    backgroundRepeat: backgroundRepeat,
    linearGradient: linearGradient?.[0],
    // 变换相关
    rotate: transformRotate,
    translate: transformTranslate,
    scale: transformScale,
    transform: transformTransform,
    // 其他
    zIndex: Number(AttributeManager.getNodeStyle(_st, 'zIndex')) || null,
    opacity: AttributeManager.getNodeStyle(_st, 'opacity'),
    // animation: AttributeManager.getNodeAnimationData(_st),
    clip: AttributeManager.getNodeStyle(_st, 'overflow') === 'hidden',
    focus: AttributeManager.getNodeStyle(_attrs, 'focus', false),
  }

  // TODO: 需要遍历一遍，存在性能问题
  // 处理style属性，运行时转换成鸿蒙样式
  Object.keys(_st).forEach((key) => {
    if (!key.startsWith('_')) {
      w3cToHarmonyStyle(normalAttributes, key, _st[key])
    }
  })

  // 处理覆盖属性：如动画的覆盖
  if (overwriteStyle) {
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

export function getNodeAttributeOrNull (node: TaroElement, key: string) {
  const value = node?._attrs?.[key]
  const isValueExist = !isUndefined(value)

  return isValueExist ? value : null
}
