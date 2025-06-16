import { DEFAULT_Components, isV2EnableTTDom } from '@tarojs/shared'

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

export function createDocumentV2() {
  const document = tt.appDocument
  const html = document.createElement('html')
  const head = document.createElement('head')
  const body = document.createElement('body')
  const app = document.createElement('app')
  app.id = 'app'
  const container = document.createElement('container')

  document.childNodes.push(html)
  html.childNodes.push(head, body)
  body.childNodes.push(container)
  container.childNodes.push(app)

  document.documentElement = html
  document.head = head
  document.body = body
  document.appElement = app

  document.getElementById = function getElementById(id: string) {
    if (id === 'app') {
      return app
    } else {
      // eslint-disable-next-line no-proto
      return this.__proto__.getElementById.call(this, id)
    }
  }

  document.getLastPage = function getLastPage() {
    // TODO：拿当前 webviewid 对应的 page
    return [...this._pageDocumentMap.values()][this._pageDocumentMap.size - 1]
  }

  document.createElement = function (type: string, ...args) {
    if (type === 'root') {
      return this.getLastPage()
    } else {
      // eslint-disable-next-line no-proto
      const el = DEFAULT_Components.has(type)
        // eslint-disable-next-line no-proto
        ? this.__proto__.createElement.call(this, type, ...args) : this.__proto__.createNativeComponent.call(this, type, {
          __tt__inner__options__: {
            name: type,
          },
        })
      // 给元素加上 scopeId
      el.setAttribute('class', '')
      return el
    }
  }

  document.performUpdate = function () {
    this.sync()
  }

  document.enqueueUpdate = function () {
    this.sync()
  }

  document.enqueueUpdateCallback = function () {
  }

  document.flushUpdateCallback = function () {
  }
  return document
}

// Note: 小程序端 vite 打包成 commonjs，const document = xxx 会报错，所以把 document 改为 taroDocumentProvider
export const taroDocumentProvider: TaroDocument =
  process.env.TARO_PLATFORM === 'web'
    ? env.document
    : (env.document = isV2EnableTTDom() ? createDocumentV2() : createDocument())
