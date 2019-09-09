import { MpNode } from './node'
import { NodeType } from './node_types'
import { requestUpdate } from './render'

function isElement (node: MpNode): node is MpElement {
  return node.nodeType === 1
}

interface Attributes {
  name: string;
  value: string;
}

export class MpElement extends MpNode {
  private props: Record<string, string> = {}

  public tagName: string

  public constructor (nodeType: NodeType, nodeName: string) {
    super(nodeType || NodeType.ELEMENT_NODE, nodeName)
    this.tagName = nodeName.toUpperCase()
  }

  public get className () {
    return this.getAttribute('class') || ''
  }

  public set className (val: string) {
    this.setAttribute('class', val)
  }

  public get cssText () {
    return this.getAttribute('style')
  }

  public set cssText (val: string) {
    this.setAttribute('style', val)
  }

  public get children () {
    return this.childNodes.filter(isElement)
  }

  public setAttribute (qualifiedName: string, value: string) {
    this.props[qualifiedName] = value
    requestUpdate(this)
  }

  public getAttribute (qualifiedName: string): string | null {
    const attr = this.props[qualifiedName]
    return attr || null
  }

  public get attributes (): Attributes[] {
    const propKeys = Object.keys(this.props)
    return propKeys.map(p => ({ name: p, value: this.props[p] }))
  }

  public get parentElement () {
    if (this.parentNode instanceof MpElement) {
      return this.parentNode
    }
    return null
  }
}
