import { TaroNode } from './node'
import { NodeType } from './node_types'
import { TaroEvent } from './event'
import { isArray, isElement, isUndefined } from '../utils/is'
import { Style } from './style'

interface Attributes {
  name: string;
  value: string;
}

export class TaroElement extends TaroNode {
  private props: Record<string, string> = {}

  public tagName: string

  public style: Style

  public constructor (nodeType: NodeType, nodeName: string) {
    super(nodeType || NodeType.ELEMENT_NODE, nodeName)
    this.tagName = nodeName.toUpperCase()
    this.style = new Style(this)
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

  public get children () {
    return this.childNodes.filter(isElement)
  }

  public hasAttribute (qualifiedName: string) {
    return !isUndefined(this.props[qualifiedName])
  }

  public hasAttributes () {
    return this.attributes.length > 0
  }

  public setAttribute (qualifiedName: string, value: string) {
    if (qualifiedName === 'style') {
      this.style.cssText = value
    } else {
      this.props[qualifiedName] = value
    }
    this.enqueueUpdate()
  }

  public getAttribute (qualifiedName: string): string | null {
    const attr = qualifiedName === 'style' ? this.style.cssText : this.props[qualifiedName]
    return attr || null
  }

  public get attributes (): Attributes[] {
    const propKeys = Object.keys(this.props)
    const style = this.style.cssText
    const attrs = propKeys.map(p => ({ name: p, value: this.props[p] }))
    return attrs.concat(style ? { name: 'style', value: style } : [])
  }

  public get parentElement () {
    if (this.parentNode instanceof TaroElement) {
      return this.parentNode
    }
    return null
  }

  public dispatchEvent (event: TaroEvent) {
    const target = event.nativeTarget = this
    const cancelable = event.cancelable
    const listeners = target.__handlers[event.type]
    if (!isArray(listeners)) {
      return
    }

    for (let i = listeners.length; i--;) {
      const listener = listeners[i]
      let result: unknown
      if (listener._stop) {
        listener._stop = false
      } else {
        result = listener.call(target, event)
      }
      if ((result === false || event._end) && cancelable) {
        event.defaultPrevented = true
      }
    }

    if (event._stop) {
      this._stopPropagation(event)
    } else {
      event._stop = true
    }

    return listeners != null
  }

  private _stopPropagation (event: TaroEvent) {
    let target = this
    // eslint-disable-next-line no-cond-assign
    while (target = target.parentNode as this) {
      const listeners = target.__handlers[event.type]

      if (!isArray(listeners)) {
        continue
      }

      for (let i = listeners.length; i--;) {
        const l = listeners[i]
        l._stop = true
      }
    }
  }
}
