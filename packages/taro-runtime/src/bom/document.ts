import { controlledComponent, isUndefined } from '@tencent/tarojs-shared'
import { TaroText } from '../dom/text'
import { TaroElement } from '../dom/element'
import { FormElement } from '../dom/form'
import { NodeType } from '../dom/node_types'
import { TaroRootElement } from '../dom/root'
import { eventSource } from '../dom/event'
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

  public getElementById<T extends TaroElement> (id: string) {
    const el = eventSource.get(id)
    return isUndefined(el) ? null : el as T
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
}

export function createDocument () {
  const doc = new TaroDocument() as TaroDocumentInstance

  doc.appendChild((doc.documentElement = doc.createElement('html')))

  doc.documentElement.appendChild((doc.head = doc.createElement('head')))

  doc.documentElement.appendChild((doc.createElement('body')))

  const app = doc.createElement('app')
  app.id = 'app'
  const container = doc.createElement('container') // 多包一层主要为了兼容 vue
  container.appendChild(app)

  doc.documentElement.lastChild.appendChild(container)

  return doc
}

export const document = (isBrowser ? doc : createDocument()) as TaroDocumentInstance
