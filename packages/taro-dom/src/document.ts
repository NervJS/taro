import { MpText } from './text'
import { MpElement } from './element'
import { NodeType } from './node_types'

export class MpDocument extends MpElement {
  public constructor () {
    super(NodeType.DOCUMENT_NODE, '#document')
  }

  public createElement (type: string) {
    return new MpElement(NodeType.ELEMENT_NODE, type)
  }

  public createTextNode (text: string) {
    return new MpText(text)
  }
}

interface MpDocumentInstance extends MpDocument {
  new (): MpDocument;
  documentElement: MpElement;
  head: MpElement;
  body: MpElement;
}

export function createDocument () {
  const doc = new MpDocument() as MpDocumentInstance

  doc.appendChild(doc.documentElement = doc.createElement('html'))

  doc.documentElement.appendChild(
    doc.head = doc.createElement('head')
  )

  doc.documentElement.appendChild(
    doc.head = doc.createElement('body')
  )

  return doc
}
