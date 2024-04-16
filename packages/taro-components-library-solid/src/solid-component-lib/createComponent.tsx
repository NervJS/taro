import { Component, JSX } from 'solid-js'
import h from 'solid-js/h'

import { camelToDashCase } from './utils'

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>
}

type StencilSolidInternalProps<ElementType> = JSX.DOMAttributes<ElementType>

export interface ComponentSupplementaryTypes {
  style?: JSX.CSSProperties
  slot?: string
}

const createComponent = <ElementType extends HTMLStencilElement>(
  _h: typeof h,
  tagName: string,
  props: StencilSolidInternalProps<ElementType>,
): any => {
  let children: JSX.Element[] = []

  if (props.children) {
    if (Array.isArray(props.children)) {
      children = props.children.map((child: any) => {
        if (typeof child === 'string') {
          return child
        } else if (typeof child === 'function') {
          return child()
        } else {
          return createComponent(_h, child.tagName, child.props)
        }
      })
    } else if (typeof props.children === 'string') {
      children = [props.children]
    } else if (typeof props.children === 'function') {
      children = [(props as any).children()]
    } else if (typeof props.children === 'object') {
      children = [createComponent(_h, tagName, {
        ...props.children,
        textContent: props.textContent ?? undefined,
      })]
    }
  }

  return _h(tagName, props, children)
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
    const propsToPass = {
      ...getProps(props),
      ref: (element: Element) => {
        syncEvents(element, props)
      }
    }

    return createComponent(h, tagName, propsToPass)
  }

  return SolidComponentWrapper
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
