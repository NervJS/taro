import { isFunction } from '@tarojs/shared'
import { Component, JSX, mergeProps, splitProps } from 'solid-js'
import h from 'solid-js/h'
import { effect as _$effect, memo } from 'solid-js/web'

import { camelToDashCase, isPropNameAnEvent, isReactiveKey, syncAttribute, syncEvent } from './utils'

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>
}

export type StencilSolidInternalProps<ElementType> = JSX.DOMAttributes<ElementType>

export interface ComponentSupplementaryTypes {
  style?: JSX.CSSProperties
  slot?: string
}

function setReactiveProps(node: HTMLElement, getterObj: Record<string, any>) {
  _$effect(() => {
    for (const key in getterObj) {
      syncAttribute(node, key, getterObj[key])
    }
  })
}

function syncEvents(node: HTMLElement, eventsMap: Map<string, () => void>) {
  for (const [key, value] of eventsMap) {
    syncEvent(node, key, value)
  }
}

export const createSolidComponent = <
  PropType,
  ElementType extends HTMLStencilElement,
  ExpandedPropsTypes = any
>(
  tagName: string,
  manipulatePropsFunction?: (
    originalProps: StencilSolidInternalProps<ElementType>,
    newProps: any
  ) => ExpandedPropsTypes,
  defineCustomElement?: () => void,
): Component<PropType & JSX.DOMAttributes<ElementType> & ComponentSupplementaryTypes> => {
  if (defineCustomElement !== undefined) {
    defineCustomElement()
  }

  function SolidComponentWrapper(props: { children: JSX.Element } & any) {
    const [local, other] = splitProps(props, ['children', 'ref'])
    const eventsMap = new Map()
    const reactiveKeys = []
    const getUnTrackProps = (_props: Record<string, any>) => {
      let propsToPass: typeof props = {}
      for (const key in _props) {
        if (!_props.hasOwnProperty(key)) {
          continue
        }
        if (isPropNameAnEvent(key)) {
          eventsMap.set(key, _props[key])
          continue
        }
        if (isReactiveKey(_props, key)) {
          reactiveKeys.push(key)
          continue
        }
        const propValue = _props[key]
        propsToPass[camelToDashCase(key)] = propValue
      }
      if (manipulatePropsFunction !== undefined) {
        propsToPass = manipulatePropsFunction(_props, propsToPass)
      }
      return propsToPass
    }

    const unTrackProps = getUnTrackProps(other)
    const [reactiveProps] = splitProps(other, reactiveKeys)

    const _mergeProps = mergeProps(unTrackProps, {
      ref: (element: HTMLElement) => {
        if (local.ref && isFunction(local.ref)) local.ref(element)
        syncEvents(element, eventsMap)
        setReactiveProps(element, reactiveProps)
      }
    })

    return memo(() => h(tagName, _mergeProps, local.children), true)
  }

  return SolidComponentWrapper as any
}
