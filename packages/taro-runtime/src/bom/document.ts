import { TaroText } from '../dom/text'
import { TaroElement } from '../dom/element'
import { NodeType } from '../dom/node_types'
import { TaroRootElement } from '../dom/root'
import { eventSource } from 'src/dom/event'

export class TaroDocument extends TaroElement {
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

  public getElementById (id: string) {
    return eventSource.get(id) || null
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
