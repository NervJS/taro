import { DEFAULT_COMPONENTS, isEnableTTDom, TT_SPECIFIC_COMPONENTS } from '@tarojs/shared'

import {
  APP,
  BODY,
  CONTAINER,
  HEAD,
  HTML
} from '../constants'
import { TaroDocument } from '../dom/document'
import env from '../env'

function createDocument (): TaroDocument {
  /**
     * <document>
     *   <html>
     *     <head></head>
     *     <body>
     *       <container>
     *         <app id="app" />
     *       </container>
     *     </body>
     *   </html>
     * </document>
     */
  const doc = new TaroDocument()
  const documentCreateElement = doc.createElement.bind(doc)
  const html = documentCreateElement(HTML)
  const head = documentCreateElement(HEAD)
  const body = documentCreateElement(BODY)
  const app = documentCreateElement(APP)
  app.id = APP
  const container = documentCreateElement(CONTAINER) // 多包一层主要为了兼容 vue

  doc.appendChild(html)
  html.appendChild(head)
  html.appendChild(body)
  body.appendChild(container)
  container.appendChild(app)

  doc.documentElement = html
  doc.head = head
  doc.body = body

  return doc
}

declare const tt: any

export function createTTDomDocument(): TaroDocument {
  const document = tt?.appDocument
  if (!document) {
    throw new Error('tt.appDocument is not found')
  }
  const html = document.createElement(HTML)
  const head = document.createElement(HEAD)
  const body = document.createElement(BODY)
  const app = document.createElement(APP)
  app.id = APP
  const container = document.createElement(CONTAINER)

  const emptyFunction = () => {}

  document.childNodes.push(html)
  html.childNodes.push(head, body)
  body.childNodes.push(container)
  container.childNodes.push(app)

  document.documentElement = html
  document.head = head
  document.body = body
  document.appElement = app

  let builtInComponents = tt?.getBuiltInComponents?.()
  if (Array.isArray(builtInComponents)) {
    builtInComponents = new Set(builtInComponents)
  } else if (!(builtInComponents instanceof Set)) {
    builtInComponents = new Set([...DEFAULT_COMPONENTS, ...TT_SPECIFIC_COMPONENTS])
  }

  document.getElementById = function getElementById(id: string) {
    if (id === 'app') {
      return app
    } else {
      return Object.getPrototypeOf(this).getElementById.call(this, id)
    }
  }

  document.getLastPage = function getLastPage() {
    let last
    for (const v of this._pageDocumentMap.values()) last = v
    return last
  }

  document.createElement = function (type: string, ...args) {
    if (type === 'root') {
      return this.getLastPage()
    } else {
      const el = builtInComponents.has(type)
        ? Object.getPrototypeOf(this).createElement.call(this, type, ...args)
        : Object.getPrototypeOf(this).createNativeComponent.call(this, type, {
          __tt__inner__options__: {
            name: type,
          },
        })
      // 给元素加上 scopeId
      el.setAttribute('class', '')

      // 保存原始的 setAttribute 和 removeAttribute
      const originalSetAttribute = el.setAttribute.bind(el)
      const originalRemoveAttribute = el.removeAttribute.bind(el)

      // 拦截 setAttribute 来处理 catchMove
      el.setAttribute = function (name: string, value: any) {
        const result = originalSetAttribute(name, value)

        // 处理 catchMove 属性
        if (name === 'catchMove') {
          if (value) {
            el.addEventListener('catchtouchmove', emptyFunction)
          } else {
            el.removeEventListener('catchtouchmove', emptyFunction)
          }
        }

        return result
      }

      // 拦截 removeAttribute 来处理 catchMove
      el.removeAttribute = function (name: string) {
        const oldValue = el.getAttribute(name)

        // 处理 catchMove 属性
        if (name === 'catchMove' && oldValue) {
          el.removeEventListener('catchtouchmove', emptyFunction)
        }

        return originalRemoveAttribute(name)
      }

      if (process.env.FRAMEWORK === 'preact') {
        const ttEventListener = el.addEventListener.bind(el)
        const ttRemoveEventListener = el.removeEventListener.bind(el)

        el.addEventListener = function (type: string, listener) {
          if (type === 'click') {
            type = 'tap'
          }

          const bindEventName = type.startsWith('bind') || type.startsWith('catch') ? type : `bind${type}`
          // 创建包装函数
          const wrapper = (event) => {
            const type = event.type
            // 对齐 modifyMpEvent 处理逻辑
            if (type === 'tap') {
              event.type = 'click'
            } else if (type === 'focus') {
              event.type = 'focusin'
            } else if (type === 'blur') {
              event.type = 'focusout'
            }
            Object.assign(event, {
              mpEvent: event,
              bubbles: true,
              cancelable: true,
            })
            listener.call(el, event)
          }

          // 保存包装函数的引用，用于后续移除
          if (!el.__eventWrappers) {
            el.__eventWrappers = new WeakMap()
          }
          el.__eventWrappers.set(listener, wrapper)

          ttEventListener(bindEventName, wrapper)
        }

        el.removeEventListener = function (type: string, listener) {
          if (type === 'click') {
            type = 'tap'
          }

          const bindEventName = type.startsWith('bind') || type.startsWith('catch') ? type : `bind${type}`
          // 获取之前保存的包装函数
          const wrapper = el.__eventWrappers?.get(listener)
          if (wrapper) {
            ttRemoveEventListener(bindEventName, wrapper)
            delete el.__eventWrappers[listener]
          }
        }
      }

      return el
    }
  }
  return document
}

// Note: 小程序端 vite 打包成 commonjs，const document = xxx 会报错，所以把 document 改为 taroDocumentProvider
export const taroDocumentProvider: TaroDocument = process.env.TARO_PLATFORM === 'web' ? env.document : (env.document =
  isEnableTTDom() ? createTTDomDocument() : createDocument())
