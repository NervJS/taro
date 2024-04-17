import { Component, createMemo, JSX, mergeProps } from 'solid-js'
import h from 'solid-js/h'

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

  const getProps = (props: any) => {

    let propsToPass: typeof props = {}

    for (const key in props) {
      if (key === 'children') {
        continue
      }

      if (!props.hasOwnProperty(key)) {
        continue
      }

      if (isPropNameAnEvent(key)) {
        continue
      }

      const propValue = props[key]
      propsToPass[camelToDashCase(key)] = propValue
    }

    if (manipulatePropsFunction !== undefined) {
      propsToPass = manipulatePropsFunction(props, propsToPass)
    }

    return propsToPass
  }

  function SolidComponentWrapper(props: { children: JSX.Element } & any) {
    const _mergeProps = mergeProps(getProps(props), { ref: (element: Element) => {
      syncEvents(element, props)
    } })
    const children = props.children
    if (children) {
      if (typeof children === 'string') {
        return createMemo(() => h(tagName, _mergeProps, children))
      } else if (Array.isArray(children)) {
        const _children = children.map((child: any) => {
          return child()
        })
        return createMemo(() => h(tagName, _mergeProps, _children))
      }

      return createMemo(() => h(tagName, _mergeProps, typeof children === 'function' ? (props as any).children(): null))

    }
    return createMemo(() => h(tagName, _mergeProps))
  }

  return SolidComponentWrapper as any
}

function syncEvents(node: Element, props: any) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const propValue = props[key]
      if (isPropNameAnEvent(key)) {
        // prop is an event
        syncEvent(node, key, propValue)
      }
    }
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
