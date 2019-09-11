import { TaroNode } from './node'
import { NodeType } from './node_types'
import { TaroEvent } from './e'
import { isArray } from './utils/is'

function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === 1
}

interface Attributes {
  name: string;
  value: string;
}

export class TaroElement extends TaroNode {
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
    this.performUpdate()
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
    if (this.parentNode instanceof TaroElement) {
      return this.parentNode
    }
    return null
  }

  public dispatchEvent (event: TaroEvent) {
    let target = event.nativeTarget = this
    const cancelable = event.cancelable
    let listeners: Function[]
    do {
      listeners = target.__handlers[event.type]
      if (!isArray(listeners)) {
        return
      }

      for (let i = listeners.length; i--;) {
        if ((listeners[i].call(target, event) === false || event._end) && cancelable) {
          event.defaultPrevented = true
        }
      }
    // eslint-disable-next-line no-unmodified-loop-condition
    } while (event.bubbles && !(cancelable && event._stop) && (target = target.parentNode as this))
    return listeners != null
  }
}
