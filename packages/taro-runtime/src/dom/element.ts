/* eslint-disable no-dupe-class-members */
import { isArray, isUndefined, Shortcuts, EMPTY_OBJ, warn, isString, toCamelCase } from '@tarojs/shared'
import { TaroNode } from './node'
import { NodeType } from './node_types'
import { TaroEvent, eventSource } from './event'
import { isElement, isHasExtractProp } from '../utils'
import { Style } from './style'
import { PROPERTY_THRESHOLD, SPECIAL_NODES } from '../constants'
import { CurrentReconciler } from '../reconciler'
import { treeToArray } from './tree'
import { ClassList } from './class-list'

interface Attributes {
  name: string;
  value: string;
}

export class TaroElement extends TaroNode {
  public props: Record<string, string> = {}

  public dataset: Record<string, unknown> = EMPTY_OBJ

  public tagName: string

  public style: Style

  public constructor (nodeType: NodeType, nodeName: string) {
    super(nodeType || NodeType.ELEMENT_NODE, nodeName)
    this.tagName = nodeName.toUpperCase()
    this.style = new Style(this)
    warn(
      this.tagName === 'MAP' && process.env.TARO_ENV === 'weapp',
      '微信小程序 map 组件的 `setting` 属性需要传递一个默认值。详情：\n https://developers.weixin.qq.com/miniprogram/dev/component/map.html'
    )
  }

  public get id () {
    return this.getAttribute('id')!
  }

  public set id (val: string) {
    this.setAttribute('id', val)
  }

  public get classList () {
    return new ClassList(this.className, this)
  }

  public get className () {
    return this.getAttribute('class') || ''
  }

  public set className (val: string) {
    this.setAttribute('class', val)
  }

  public get cssText () {
    return this.getAttribute('style') || ''
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

  public focus () {
    this.setAttribute('focus', true)
  }

  public blur () {
    this.setAttribute('focus', false)
  }

  public setAttribute (qualifiedName: string, value: any): void {
    warn(
      isString(value) && value.length > PROPERTY_THRESHOLD,
      `元素 ${this.nodeName} 的 属性 ${qualifiedName} 的值数据量过大，可能会影响渲染性能。考虑降低图片转为 base64 的阈值或在 CSS 中使用 base64。`
    )

    if (qualifiedName === 'style') {
      this.style.cssText = value as string
      qualifiedName = Shortcuts.Style
    } else if (qualifiedName === 'id') {
      eventSource.delete(this.uid)
      value = String(value)
      this.props[qualifiedName] = this.uid = value
      eventSource.set(value, this)
      qualifiedName = 'uid'
    } else {
      if (qualifiedName === 'class') {
        qualifiedName = Shortcuts.Class
      } else if (qualifiedName.startsWith('data-')) {
        if (this.dataset === EMPTY_OBJ) {
          this.dataset = Object.create(null)
        }
        this.dataset[toCamelCase(qualifiedName.replace(/^data-/, ''))] = value
      } else if (this.nodeName === 'view' && !isHasExtractProp(this) && !this.isAnyEventBinded()) {
        // pure-view => static-view
        this.enqueueUpdate({
          path: `${this._path}.${Shortcuts.NodeName}`,
          value: 'static-view'
        })
      }
      this.props[qualifiedName] = value as string
    }

    CurrentReconciler.setAttribute?.(this, qualifiedName, value)

    this.enqueueUpdate({
      path: `${this._path}.${toCamelCase(qualifiedName)}`,
      value
    })
  }

  public removeAttribute (qualifiedName: string) {
    if (qualifiedName === 'style') {
      this.style.cssText = ''
    } else {
      delete this.props[qualifiedName]
    }

    CurrentReconciler.removeAttribute?.(this, qualifiedName)

    this.enqueueUpdate({
      path: `${this._path}.${toCamelCase(qualifiedName)}`,
      value: ''
    })

    if (this.nodeName === 'view' && !isHasExtractProp(this) && !this.isAnyEventBinded()) {
      // static-view => pure-view
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.NodeName}`,
        value: 'pure-view'
      })
    }
  }

  public getAttribute (qualifiedName: string): string {
    const attr = qualifiedName === 'style' ? this.style.cssText : this.props[qualifiedName]
    return attr ?? ''
  }

  public get attributes (): Attributes[] {
    const propKeys = Object.keys(this.props)
    const style = this.style.cssText
    const attrs = propKeys.map(p => ({ name: p, value: this.props[p] }))
    return attrs.concat(style ? { name: 'style', value: style } : [])
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

  public dispatchEvent (event: TaroEvent) {
    const cancelable = event.cancelable
    const listeners = this.__handlers[event.type]
    if (!isArray(listeners)) {
      return
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

  public get textContent () {
    let text = ''
    for (let i = 0; i < this.childNodes.length; i++) {
      const element = this.childNodes[i]
      text += element.textContent
    }
    return text
  }

  public set textContent (text: string) {
    super.textContent = text
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

  public addEventListener (type, handler, options) {
    const name = this.nodeName
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
    if (!this.isAnyEventBinded() && SPECIAL_NODES.indexOf(name) > -1) {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.NodeName}`,
        value: isHasExtractProp(this) ? `static-${name}` : `pure-${name}`
      })
    }
  }
}
