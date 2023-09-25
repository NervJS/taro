/**
 * Modify from https://github.com/diondree/stencil-vue2-output-target/blob/master/vue-component-lib/utils.ts
 * MIT License https://github.com/diondree/stencil-vue2-output-target/blob/master/LICENSE.md
 */
import Vue, { CreateElement,VNode } from 'vue'

export const createCommonMethod = (methodName: string) =>
  function (...args: any[]) {
    this.$refs.wc[methodName](...args)
  } as unknown

export const toLowerCase = (str: string) => str.toLowerCase()

export const toDashCase = (str: string) =>
  toLowerCase(
    str
      .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
      .trim()
      .replace(/ /g, '-')
  )

export const createCommonRender = (
  tagName: string,
  eventNames: string[] = [],
  defineCustomElement: any,
) => {
  /**
   * Create a Vue component wrapper around a Web Component.
   * Note: The `props` here are not all properties on a component.
   * They refer to whatever properties are set on an instance of a component.
   */

  if (!DEPRECATED_ADAPTER_COMPONENT && defineCustomElement !== undefined) {
    defineCustomElement()
  }

  return function (createElement: CreateElement): VNode {
    const vueElement = this as Vue
    const allListeners = eventNames.reduce((listeners, eventName) => {
      return {
        ...listeners,
        [eventName]: (event: CustomEvent<any>) => {
          vueElement.$emit(eventName, event)
          // Note(taro): 优化 input、change 事件与 v-model 兼容性问题
          if (['input', 'change'].includes(eventName)) {
            vueElement.$emit('update:modelValue', event.detail.value)
          }
        },
      }
    }, vueElement.$listeners)
    const attributes = vueElement.$props
      ? Object.keys(vueElement.$props).reduce((attrs: any, prop: string) => {
        const attributeName = toDashCase(prop)
        attrs[attributeName] = vueElement.$props[prop]
        return attrs
      }, {})
      : {}
    return createElement(
      tagName,
      {
        ref: 'wc',
        domProps: vueElement.$props,
        on: {
          ...allListeners,
          // Note(taro): click 事件绑定 tap 事件触发
          click: (event) => {
            typeof allListeners.click === 'function' && allListeners.click(event)
            vueElement.$emit('tap', event)
          }
        },
        attrs: { ...attributes, 'data-testid': tagName },
      },
      [vueElement.$slots.default]
    )
  }
}
