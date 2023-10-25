/**
 * Modify from https://github.com/ionic-team/stencil-ds-output-targets/blob/main/packages/react-output-target/react-component-lib/createComponent.ts
 * MIT License https://github.com/ionic-team/stencil-ds-output-targets/blob/main/LICENSE
 */
import React, { createElement } from 'react'

import { attachProps, camelToDashCase, createForwardRef, dashToPascalCase, isCoveredByReact, mergeRefs } from './utils'

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>
}

interface StencilReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef: React.RefObject<ElementType>
  ref?: React.Ref<any>
}

export const createReactComponent = <
  PropType,
  ElementType extends HTMLStencilElement,
  ContextStateType = any,
  ExpandedPropsTypes = any
>(
  tagName: string,
  ReactComponentContext?: React.Context<ContextStateType>,
  manipulatePropsFunction?: (
    originalProps: StencilReactInternalProps<ElementType>,
    propsToPass: any
  ) => ExpandedPropsTypes,
  defineCustomElement?: () => void
) => {
  if (!DEPRECATED_ADAPTER_COMPONENT && defineCustomElement !== undefined) {
    defineCustomElement()
  }

  const displayName = dashToPascalCase(tagName)
  const ReactComponent = class extends React.Component<StencilReactInternalProps<ElementType>> {
    componentEl!: ElementType

    setComponentElRef = (element: ElementType) => {
      this.componentEl = element
    }

    // eslint-disable-next-line no-useless-constructor
    constructor (props: StencilReactInternalProps<ElementType>) {
      super(props)
    }

    componentDidMount () {
      this.componentDidUpdate(this.props)
    }

    componentDidUpdate (prevProps: StencilReactInternalProps<ElementType>) {
      attachProps(this.componentEl, this.props, prevProps)
    }

    render () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, forwardedRef, className, ref, style, ...cProps } = this.props

      let propsToPass = Object.keys(cProps).reduce((acc: any, name) => {
        const value = (cProps as any)[name]

        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
          const eventName = name.substring(2).toLowerCase()
          if (typeof document !== 'undefined' && isCoveredByReact(eventName)) {
            acc[name] = value
          }
        } else {
          // we should only render strings, booleans, and numbers as attrs in html.
          // objects, functions, arrays etc get synced via properties on mount.
          const type = typeof value

          if (['string', 'boolean', 'number'].includes(type)) {
            acc[camelToDashCase(name)] = value
          }
        }
        return acc
      }, {} as ExpandedPropsTypes)

      if (manipulatePropsFunction) {
        propsToPass = manipulatePropsFunction(this.props, propsToPass)
      }

      const newProps: Omit<StencilReactInternalProps<ElementType>, 'forwardedRef'> = {
        ...propsToPass,
        ref: mergeRefs(forwardedRef, this.setComponentElRef),
        // Note(taro): 需处理 string 类型的 style，调整到 manipulatePropsFunction 方法中判断是否需注入 (string 类型在 attachProps 中处理)
        // style
      }

      /**
       * We use createElement here instead of
       * React.createElement to work around a
       * bug in Vite (https://github.com/vitejs/vite/issues/6104).
       * React.createElement causes all elements to be rendered
       * as <tagname> instead of the actual Web Component.
       */
      return createElement(tagName, newProps, children)
    }

    static get displayName () {
      return displayName
    }
  }

  // If context was passed to createReactComponent then conditionally add it to the Component Class
  if (ReactComponentContext) {
    ReactComponent.contextType = ReactComponentContext
  }

  return createForwardRef<PropType, ElementType>(ReactComponent, displayName)
}
