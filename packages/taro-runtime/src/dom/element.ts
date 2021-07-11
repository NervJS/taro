import { inject, injectable } from 'inversify'
import { isArray, isUndefined, Shortcuts, EMPTY_OBJ, warn, isString, toCamelCase } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { TaroNode } from './node'
import { NodeType } from './node_types'
import { eventSource } from './event-source'
import { isElement, isHasExtractProp, shortcutAttr } from '../utils'
import { Style } from './style'
import { treeToArray } from './tree'
import { ClassList } from './class-list'
import {
  ID,
  CLASS,
  STYLE,
  FOCUS,
  VIEW,
  STATIC_VIEW,
  PURE_VIEW,
  PROPERTY_THRESHOLD
} from '../constants'

import type { TaroEvent } from './event'
import type { Attributes, InstanceNamedFactory } from '../interface'
import type { TaroNodeImpl } from '../dom-external/node-impl'
import type { TaroElementImpl } from '../dom-external/element-impl'
import type { Hooks } from '../hooks'

@injectable()
export class TaroElement extends TaroNode {
  public tagName: string
  public props: Record<string, any> = {}
  public style: Style
  public dataset: Record<string, unknown> = EMPTY_OBJ
  public innerHTML: string

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroNodeImpl) nodeImpl: TaroNodeImpl,
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.Hooks) hooks: Hooks,
    @inject(SERVICE_IDENTIFIER.TaroElementImpl) elementImpl: TaroElementImpl
  ) {
    super(nodeImpl, getElement, hooks)
    elementImpl.bind(this)
    this.nodeType = NodeType.ELEMENT_NODE
    this.style = new Style(this)
  }

  private _stopPropagation (event: TaroEvent) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let target = this
    // eslint-disable-next-line no-cond-assign
    while ((target = target.parentNode as this)) {
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

  public get id (): string {
    return this.getAttribute(ID)!
  }

  public set id (val: string) {
    this.setAttribute(ID, val)
  }

  public get className (): string {
    return this.getAttribute(CLASS) || ''
  }

  public set className (val: string) {
    this.setAttribute(CLASS, val)
  }

  public get cssText (): string {
    return this.getAttribute(STYLE) || ''
  }

  public get classList (): ClassList {
    return new ClassList(this.className, this)
  }

  public get children (): TaroElement[] {
    return this.childNodes.filter(isElement)
  }

  public get attributes (): Attributes[] {
    const props = this.props
    const propKeys = Object.keys(props)
    const style = this.style.cssText
    const attrs = propKeys.map(key => ({ name: key, value: props[key] }))
    return attrs.concat(style ? { name: STYLE, value: style } : [])
  }

  public get textContent (): string {
    let text = ''
    const childNodes = this.childNodes

    for (let i = 0; i < childNodes.length; i++) {
      text += childNodes[i].textContent
    }

    return text
  }

  public set textContent (text: string) {
    super.textContent = text
  }

  public hasAttribute (qualifiedName: string): boolean {
    return !isUndefined(this.props[qualifiedName])
  }

  public hasAttributes (): boolean {
    return this.attributes.length > 0
  }

  public focus () {
    this.setAttribute(FOCUS, true)
  }

  public blur () {
    this.setAttribute(FOCUS, false)
  }

  public setAttribute (qualifiedName: string, value: any): void {
    process.env.NODE_ENV !== 'production' && warn(
      isString(value) && value.length > PROPERTY_THRESHOLD,
      `元素 ${this.nodeName} 的 属性 ${qualifiedName} 的值数据量过大，可能会影响渲染性能。考虑降低图片转为 base64 的阈值或在 CSS 中使用 base64。`
    )

    const isPureView = this.nodeName === VIEW && !isHasExtractProp(this) && !this.isAnyEventBinded()

    switch (qualifiedName) {
      case STYLE:
        this.style.cssText = value as string
        break
      case ID:
        eventSource.delete(this.uid)
        value = String(value)
        this.props[qualifiedName] = this.uid = value
        eventSource.set(value, this)
        break
      default:
        this.props[qualifiedName] = value as string

        if (qualifiedName.startsWith('data-')) {
          if (this.dataset === EMPTY_OBJ) {
            this.dataset = Object.create(null)
          }
          this.dataset[toCamelCase(qualifiedName.replace(/^data-/, ''))] = value
        }
        break
    }

    qualifiedName = shortcutAttr(qualifiedName)

    const payload = {
      path: `${this._path}.${toCamelCase(qualifiedName)}`,
      value
    }

    this.hooks.modifySetAttrPayload?.(this, qualifiedName, payload)

    this.enqueueUpdate(payload)

    // pure-view => static-view
    if (isPureView && isHasExtractProp(this)) {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.NodeName}`,
        value: STATIC_VIEW
      })
    }
  }

  public removeAttribute (qualifiedName: string) {
    const isStaticView = this.nodeName === VIEW && isHasExtractProp(this) && !this.isAnyEventBinded()

    if (qualifiedName === STYLE) {
      this.style.cssText = ''
    } else {
      const isInterrupt = this.hooks.onRemoveAttribute?.(this, qualifiedName)
      if (isInterrupt) {
        return
      }

      if (!this.props.hasOwnProperty(qualifiedName)) {
        return
      }
      delete this.props[qualifiedName]
    }

    qualifiedName = shortcutAttr(qualifiedName)

    const payload = {
      path: `${this._path}.${toCamelCase(qualifiedName)}`,
      value: ''
    }

    this.hooks.modifyRmAttrPayload?.(this, qualifiedName, payload)

    this.enqueueUpdate(payload)

    // static-view => pure-view
    if (isStaticView && !isHasExtractProp(this)) {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.NodeName}`,
        value: PURE_VIEW
      })
    }
  }

  public getAttribute (qualifiedName: string): string {
    const attr = qualifiedName === STYLE ? this.style.cssText : this.props[qualifiedName]
    return attr ?? ''
  }

  public getElementsByTagName (tagName: string): TaroElement[] {
    return treeToArray(this, (el) => {
      return el.nodeName === tagName || (tagName === '*' && this !== el)
    })
  }

  public getElementsByClassName (className: string): TaroElement[] {
    return treeToArray(this, (el) => {
      const classList = el.classList
      const classNames = className.trim().split(/\s+/)
      return classNames.every(c => classList.has(c))
    })
  }

  public dispatchEvent (event: TaroEvent): boolean {
    const cancelable = event.cancelable

    const listeners = this.__handlers[event.type]

    if (!isArray(listeners)) {
      return false
    }

    for (let i = listeners.length; i--;) {
      const listener = listeners[i]
      let result: unknown
      if (listener._stop) {
        listener._stop = false
      } else {
        result = listener.call(this, event)
      }
      if ((result === false || event._end) && cancelable) {
        event.defaultPrevented = true
      }

      if (event._end && event._stop) {
        break
      }
    }

    if (event._stop) {
      this._stopPropagation(event)
    } else {
      event._stop = true
    }

    return listeners != null
  }

  public addEventListener (type, handler, options) {
    const name = this.nodeName
    const SPECIAL_NODES = this.hooks.getSpecialNodes()

    if (!this.isAnyEventBinded() && SPECIAL_NODES.indexOf(name) > -1) {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.NodeName}`,
        value: name
      })
    }

    super.addEventListener(type, handler, options)
  }

  public removeEventListener (type, handler) {
    super.removeEventListener(type, handler)

    const name = this.nodeName
    const SPECIAL_NODES = this.hooks.getSpecialNodes()

    if (!this.isAnyEventBinded() && SPECIAL_NODES.indexOf(name) > -1) {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.NodeName}`,
        value: isHasExtractProp(this) ? `static-${name}` : `pure-${name}`
      })
    }
  }
}
