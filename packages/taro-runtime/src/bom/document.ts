import { controlledComponent, isUndefined } from '@tarojs/shared'
import { TaroText } from '../dom/text'
import { TaroElement } from '../dom/element'
import { FormElement } from '../dom/form'
import { NodeType } from '../dom/node_types'
import { TaroRootElement } from '../dom/root'
import { eventSource, createEvent } from '../dom/event'
import { isBrowser, doc } from '../env'

export class TaroDocument extends TaroElement {
  public constructor () {
    super(NodeType.DOCUMENT_NODE, '#document')
  }

  public createElement (type: string) {
    if (type === 'root') {
      return new TaroRootElement()
    }

    if (controlledComponent.has(type)) {
      return new FormElement(NodeType.ELEMENT_NODE, type)
    }

    return new TaroElement(NodeType.ELEMENT_NODE, type)
  }

  public createTextNode (text: string) {
    return new TaroText(text)
  }

  public getElementById<T extends TaroElement> (id: string | undefined | null) {
    const el = eventSource.get(id)
    return isUndefined(el) ? null : el as T
  }

  public getElementsByTagName<T extends TaroElement> (tagName: string) {
    const elements: T[] = []
    eventSource.forEach((node) => {
      if (node.nodeType !== NodeType.ELEMENT_NODE) {
        return
      }
      if (node.nodeName === tagName || (tagName === '*' && node !== this)) {
        elements.push(node as T)
      }
    })

    return elements
  }

  public querySelector (query: string) {
    // 为了 Vue3 的乞丐版实现
    if (/^#/.test(query)) {
      return this.getElementById(query.slice(1))
    }
    return null
  }

  // @TODO: @PERF: 在 hydrate 移除掉空的 node
  public createComment () {
    return new TaroText('')
  }
}

interface TaroDocumentInstance extends TaroDocument {
  new (): TaroDocument;
  documentElement: TaroElement;
  head: TaroElement;
  body: TaroElement;
  createEvent: typeof createEvent
}

export function createDocument () {
  const doc = new TaroDocument() as TaroDocumentInstance

  doc.appendChild((doc.documentElement = doc.createElement('html')))

  doc.documentElement.appendChild((doc.head = doc.createElement('head')))

  const body = doc.createElement('body')
  doc.documentElement.appendChild(body)
  doc.body = body

  const app = doc.createElement('app')
  app.id = 'app'
  const container = doc.createElement('container') // 多包一层主要为了兼容 vue
  container.appendChild(app)

  doc.documentElement.lastChild.appendChild(container)
  doc.createEvent = createEvent

  return doc
}

export const document = (isBrowser ? doc : createDocument()) as TaroDocumentInstance
