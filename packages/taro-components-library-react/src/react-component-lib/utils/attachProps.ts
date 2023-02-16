/**
 * Modify from https://github.com/ionic-team/stencil-ds-output-targets/blob/main/packages/react-output-target/react-component-lib/utils/attachProps.ts
 * MIT License https://github.com/ionic-team/stencil-ds-output-targets/blob/main/LICENSE
 */
import { camelToDashCase } from './case'

const arrayToMap = (arr: string[] | DOMTokenList) => {
  const map = new Map<string, string>();
  (arr as string[]).forEach((s: string) => map.set(s, s))
  return map
}

export const getClassName = (classList: DOMTokenList, newProps: any, oldProps: any) => {
  const newClassProp: string = newProps.className || newProps.class
  const oldClassProp: string = oldProps.className || oldProps.class
  // map the classes to Maps for performance
  const currentClasses = arrayToMap(classList)
  const incomingPropClasses = arrayToMap(newClassProp ? newClassProp.split(' ') : [])
  const oldPropClasses = arrayToMap(oldClassProp ? oldClassProp.split(' ') : [])
  const finalClassNames: string[] = []
  // loop through each of the current classes on the component
  // to see if it should be a part of the classNames added
  currentClasses.forEach((currentClass) => {
    if (incomingPropClasses.has(currentClass)) {
      // add it as its already included in classnames coming in from newProps
      finalClassNames.push(currentClass)
      incomingPropClasses.delete(currentClass)
    } else if (!oldPropClasses.has(currentClass)) {
      // add it as it has NOT been removed by user
      finalClassNames.push(currentClass)
    }
  })
  incomingPropClasses.forEach((s) => finalClassNames.push(s))
  return finalClassNames.join(' ')
}

/**
 * Checks if an event is supported in the current execution environment.
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
export const isCoveredByReact = (__eventNameSuffix: string) => false

export const syncEvent = (
  node: Element & { __events?: { [key: string]: ((e: Event) => any) | undefined } },
  eventName: string,
  newEventHandler?: (e: Event) => any
) => {
  const eventStore = node.__events || (node.__events = {})
  const oldEventHandler = eventStore[eventName]

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventName, oldEventHandler)
  }

  // Bind new listener.
  node.addEventListener(
    eventName,
    (eventStore[eventName] = function handler (e: Event) {
      if (newEventHandler) {
        newEventHandler.call(this, e)
      }
    })
  )
}

export const attachProps = (node: HTMLElement, newProps: any, oldProps: any = {}) => {
  // some test frameworks don't render DOM elements, so we test here to make sure we are dealing with DOM first
  if (node instanceof Element) {
    // add any classes in className to the class list
    const className = getClassName(node.classList, newProps, oldProps)
    if (className !== '') {
      node.className = className
    }

    Object.keys(newProps).forEach((name) => {
      if ((name === 'style' && typeof newProps[name] !== 'string') || ['children', 'ref', 'class', 'className', 'forwardedRef'].includes(name)) {
        return
      }
      if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
        const eventName = name.substring(2)
        const eventNameLc = eventName.toLowerCase()

        if (!isCoveredByReact(eventNameLc)) {
          syncEvent(node, eventNameLc, newProps[name])
        }
      } else {
        (node as any)[name] = newProps[name]
        const propType = typeof newProps[name]
        if (propType === 'string') {
          node.setAttribute(camelToDashCase(name), newProps[name])
        }
      }
    })
  }
}
