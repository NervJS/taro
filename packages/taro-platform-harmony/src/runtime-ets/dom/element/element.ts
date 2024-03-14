import { eventSource } from '@tarojs/runtime/dist/runtime.esm'
import { EMPTY_OBJ, toCamelCase } from '@tarojs/shared'

import { ATTRIBUTES_CALLBACK_TRIGGER_MAP, ID } from '../../constant'
import { findChildNodeWithDFS } from '../../utils'
import { initComponentNodeInfo, triggerAttributesCallback } from '../../utils/info'
import { bindAnimation } from '../bind'
import { ClassList } from '../class-list'
import { type ICSSStyleDeclaration, createCSSStyleDeclaration } from '../cssStyleDeclaration'
import { NodeType, TaroNode } from '../node'
import StyleSheet, { HarmonyStyle } from '../stylesheet'

import type { BaseTouchEvent, ITouchEvent, StandardProps } from '@tarojs/components/types'
import type { TaroAny } from '../../utils'

type NamedNodeMap = { name: string, value: string }[]

export interface TaroExtraProps {
  compileMode?: string | boolean
  compileIf?: boolean
  disabled?: boolean
}

export class TaroElement<
  T extends StandardProps<any, U> = StandardProps,
  U extends BaseTouchEvent<any> = ITouchEvent
> extends TaroNode {
  public _innerHTML = ''
  public _nodeInfo: TaroAny = {}
  public readonly tagName: string
  public dataset: Record<string, unknown> = EMPTY_OBJ
  public _attrs: T & TaroExtraProps = {} as T & TaroExtraProps

  constructor(tagName: string) {
    super(tagName.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase(), NodeType.ELEMENT_NODE)
    this.tagName = this.nodeName
    this._style = createCSSStyleDeclaration(this)
    initComponentNodeInfo(this)
    bindAnimation(this)
  }

  public set id(value: string) {
    this.setAttribute('id', value)
  }

  public get id(): string {
    return this.getAttribute('id') || this._nid
  }

  public set className(value: string) {
    this.setAttribute('class', value)
  }

  public get className(): string {
    return this.getAttribute('class') || ''
  }

  public get classList(): ClassList {
    return new ClassList(this.className, this)
  }

  public get attributes(): NamedNodeMap {
    const list: NamedNodeMap = []

    Object.keys(this._attrs).forEach((name) => {
      const value: TaroAny = this._attrs[name]

      list.push({ name, value })
    })

    return list
  }

  public get children(): TaroElement[] {
    return this.childNodes.filter((node) => node.nodeType === NodeType.ELEMENT_NODE) as TaroElement[]
  }

  public setAttribute(name: string, value: TaroAny): void {
    switch (name) {
      case ID:
        eventSource.delete(this._attrs.id)
        eventSource.set(value, this as TaroAny)
        break
      default:
        if (name.startsWith('data-')) {
          if (this.dataset === EMPTY_OBJ) {
            this.dataset = Object.create(null)
          }
          this.dataset[toCamelCase(name.replace(/^data-/, ''))] = value
        }
        break
    }

    if (name === ID) {
      eventSource.delete(this._attrs.id)
      eventSource.set(value, this as TaroAny)
    }

    this._attrs[name] = value

    const attributeTriggerValue: TaroAny = ATTRIBUTES_CALLBACK_TRIGGER_MAP[name]
    if (attributeTriggerValue) {
      const triggerName: TaroAny = attributeTriggerValue.triggerName
      const valueInspect: TaroAny = attributeTriggerValue.valueInspect

      if (valueInspect && !valueInspect(value)) return

      triggerAttributesCallback(this, triggerName)
    }
  }

  public getAttribute(name: string): string {
    return this._attrs[name]
  }

  public removeAttribute(name: string): void {
    this._attrs[name] = null
  }

  public hasAttribute(name: string): boolean {
    return !!this._attrs[name]
  }

  public hasAttributes(): boolean {
    return Object.keys(this._attrs).length > 0
  }

  public getElementById<T extends TaroElement = TaroElement>(id: string | undefined | null) {
    return findChildNodeWithDFS<T>(
      this as TaroAny,
      (el) => {
        return el.id === id
      },
      false
    )
  }

  public getElementsByTagName<T extends TaroElement = TaroElement>(tagName: string) {
    return (
      findChildNodeWithDFS<T>(
        this as TaroAny,
        (el) => {
          return el.nodeName === tagName || (tagName === '*' && (this as TaroAny) !== el)
        },
        true
      ) || []
    )
  }

  public getElementsByClassName<T extends TaroElement = TaroElement>(className: string) {
    const classNames = className.trim().split(new RegExp('\\s+'))

    return (
      findChildNodeWithDFS<T>(
        this as TaroAny,
        (el) => {
          const classList = el.classList
          return classNames.every((c) => {
            const bool = classList.contains(c)

            return bool
          })
        },
        true
      ) || []
    )
  }

  public set innerHTML(value: string) {
    if (this.nodeType === NodeType.ELEMENT_NODE && this.ownerDocument) {
      const ele = this.ownerDocument.createElement('inner-html')
      ele._innerHTML = value
      this.appendChild(ele as TaroAny)
    }
  }

  public get innerHTML(): string {
    return this._innerHTML
  }

  // 存放的样式，获取其实跟获取style是一样的，只不过这里取的更快捷，不需要走style的get方法进到cssStyleDeclaration
  public _st = new StyleSheet()

  // 经转换后的鸿蒙样式
  public get hmStyle() {
    return this._st.hmStyle
  }

  public _style: ICSSStyleDeclaration | null = null

  public get style(): ICSSStyleDeclaration | null {
    return this._style
  }

  // 伪类，不存在style动态设置，均已被转换为鸿蒙样式
  // 可根据实际情况，迁移到具体的组件中，如View、ScrollView中，Text\Image其实是不需要的
  public _pseudo_before: StyleSheet | null = null

  public set_pseudo_before(value: HarmonyStyle | null) {
    if (value) {
      if (!this._pseudo_before) {
        this._pseudo_before = new StyleSheet()
      }
      Object.keys(value).forEach(key => {
        this._pseudo_before!.hmStyle[key] = value[key]
      })
    } else {
      this._pseudo_before = null
    }
  }

  public _pseudo_after: StyleSheet | null = null

  public set_pseudo_after(value: HarmonyStyle | null) {
    if (value) {
      if (!this._pseudo_after) {
        this._pseudo_after = new StyleSheet()
      }
      Object.keys(value).forEach(key => {
        this._pseudo_after!.hmStyle[key] = value[key]
      })
    } else {
      this._pseudo_after = null
    }
  }
}
