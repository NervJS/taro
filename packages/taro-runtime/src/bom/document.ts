import { TaroText } from '../dom/text'
import { TaroElement } from '../dom/element'
import { NodeType } from '../dom/node_types'
import { TaroRootElement } from '../dom/root'
import { eventSource } from 'src/dom/event'

export class TaroDocument extends TaroElement {
  private app = this.createElement('app')

  public constructor () {
    super(NodeType.DOCUMENT_NODE, '#document')
  }

  public createElement (type: string) {
    if (type === 'root') {
      return new TaroRootElement()
    }
    return new TaroElement(NodeType.ELEMENT_NODE, type)
  }

  public createTextNode (text: string) {
    return new TaroText(text)
  }

  public getElementById<T extends TaroElement> (id: string) {
    if (id === 'app') {
      return this.app
    }
    return eventSource.get(id) as T || null
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

  doc.appendChild(doc.documentElement = doc.createElement('html'))

  doc.documentElement.appendChild(
    doc.head = doc.createElement('head')
  )

  doc.documentElement.appendChild(
    doc.head = doc.createElement('body')
  )

  return doc
}

export const document = createDocument()
