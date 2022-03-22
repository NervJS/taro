import { inject, injectable } from 'inversify'
import { controlledComponent, isUndefined } from '@tarojs/shared'
import { SID_TARO_TEXT_FACTORY } from '../constants/identifiers'
import { TaroElement } from '../dom/element'
import { NodeType } from '../dom/node_types'
import { eventSource } from '../dom/event-source'
import { ElementNames, InstanceFactory } from '../interface'
import {
  ROOT_STR,
  DOCUMENT_ELEMENT_NAME,
  COMMENT
} from '../constants'

import type { FormElement } from '../dom/form'
import type { TaroRootElement } from '../dom/root'
import type { TaroText } from '../dom/text'

@injectable()
export class TaroDocument extends TaroElement {
  private _getText: InstanceFactory<TaroText>

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SID_TARO_TEXT_FACTORY) getText: InstanceFactory<TaroText>
  ) {
    super()
    this._getText = getText
    this.nodeType = NodeType.DOCUMENT_NODE
    this.nodeName = DOCUMENT_ELEMENT_NAME
  }

  public createElement (type: string): TaroElement | TaroRootElement | FormElement {
    const getElement = this._getElement

    if (type === ROOT_STR) {
      return getElement<TaroRootElement>(ElementNames.RootElement)()
    }

    if (controlledComponent.has(type)) {
      return getElement<FormElement>(ElementNames.FormElement)(type)
    }

    return getElement<TaroElement>(ElementNames.Element)(type)
  }

  // an ugly fake createElementNS to deal with @vue/runtime-dom's
  // support mounting app to svg container since vue@3.0.8
  public createElementNS (_svgNS: string, type: string): TaroElement | TaroRootElement | FormElement {
    return this.createElement(type)
  }

  public createTextNode (text: string): TaroText {
    return this._getText(text)
  }

  public getElementById<T extends TaroElement> (id: string | undefined | null): T | null {
    const el = eventSource.get(id)
    return isUndefined(el) ? null : el as T
  }

  public querySelector<T extends TaroElement> (query: string): T | null {
    // 为了 Vue3 的乞丐版实现
    if (/^#/.test(query)) {
      return this.getElementById<T>(query.slice(1))
    }
    return null
  }

  public querySelectorAll () {
    // fake hack
    return []
  }

  // @TODO: @PERF: 在 hydrate 移除掉空的 node
  public createComment (): TaroText {
    const textnode = this._getText('')
    textnode.nodeName = COMMENT
    return textnode
  }
}
