import { MpNode } from './node'
import { NodeType } from './node_types'

function isElement (node): node is MpElement {
  return node.nodeType === 1
}

export class MpElement extends MpNode {
  public constructor (nodeType: NodeType, nodeName: string) {
    super(nodeType || 1, nodeName)
    this.attributes = []
    this.__handlers = {}
    this.style = {}
  }

  public get className () { return this.getAttribute('class') }

  public set className (val) { this.setAttribute('class', val) }

  public get cssText () { return this.getAttribute('style') }

  public set cssText (val) { this.setAttribute('style', val) }

  public get children () {
    return this.childNodes.filter(isElement)
  }

  public setAttribute (key, value) {
    this.setAttributeNS(null, key, value)
  }

  public getAttribute (key) {
    return this.getAttributeNS(null, key)
  }

  public removeAttribute (key) {
    this.removeAttributeNS(null, key)
  }

  public setAttributeNS (ns, name, value) {
    let attr = findWhere(this.attributes, createAttributeFilter(ns, name), false, false)
    if (!attr) this.attributes.push(attr = { ns, name })
    attr.value = String(value)
  }

  public getAttributeNS (ns, name) {
    const attr = findWhere(this.attributes, createAttributeFilter(ns, name), false, false)
    return attr && attr.value
  }

  public removeAttributeNS (ns, name) {
    splice(this.attributes, createAttributeFilter(ns, name), false, false)
  }

  public addEventListener (type, handler) {
    (this.__handlers[toLower(type)] || (this.__handlers[toLower(type)] = [])).push(handler)
  }

  public removeEventListener (type, handler) {
    splice(this.__handlers[toLower(type)], handler, false, true)
  }

  public dispatchEvent (event) {
    let t = event.target = this
    const c = event.cancelable
    let l; let i
    do {
      event.currentTarget = t
      l = t.__handlers && t.__handlers[toLower(event.type)]
      if (l) {
        for (i = l.length; i--;) {
          if ((l[i].call(t, event) === false || event._end) && c) {
            event.defaultPrevented = true
          }
        }
      }
    } while (event.bubbles && !(c && event._stop) && (t = t.parentNode))
    return l != null
  }
}
