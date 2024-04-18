import { Component, JSX, mergeProps, splitProps } from 'solid-js'
import h from 'solid-js/h'
import { memo } from 'solid-js/web'

import { camelToDashCase } from './utils'

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>
}

export type StencilSolidInternalProps<ElementType> = JSX.DOMAttributes<ElementType>

export interface ComponentSupplementaryTypes {
  style?: JSX.CSSProperties
  slot?: string
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
    const [local, other] = splitProps(props, ['children'])
    const eventsMap = new Map()
    const getProps = (_props: any) => {

      let propsToPass: typeof props = {}

      for (const key in _props) {
        if (!_props.hasOwnProperty(key)) {
          continue
        }
        if (isPropNameAnEvent(key)) {
          eventsMap.set(key, _props[key])
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

    const _mergeProps = mergeProps(getProps(other), { ref: (element: Element) => {
      syncEvents(element, eventsMap)
    } })

    return memo(() => h(tagName, _mergeProps, local.children), true)
  }

  return SolidComponentWrapper as any
}

function syncEvents(node: Element, eventsMap: Map<string, () => void>) {
  for (const [key, value] of eventsMap) {
    syncEvent(node, key, value)
  }
}

function syncEvent(node: Element & { __events?: { [key: string]: ((e: Event) => any) | undefined } }, propName: string, propValue: any) {
  const eventName = propName.substring(2)[0].toLowerCase() + propName.substring(3)

  const eventStore = node.__events || (node.__events = {})
  const oldEventHandler = eventStore[eventName]

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventName, oldEventHandler)
  }

  node.addEventListener(
    eventName,
    (eventStore[eventName] = function handler(e: Event) {
      if (propValue) {
        propValue.call(this, e)
      }
    })
  )
}

function isPropNameAnEvent(propName: string) {
  return propName.startsWith('on') && propName[2] === propName[2].toUpperCase()
}
