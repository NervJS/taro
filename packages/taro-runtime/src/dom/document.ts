import { inject, injectable } from 'inversify'
import { controlledComponent, isUndefined } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { TaroElement } from '../dom/element'
import { NodeType } from '../dom/node_types'
import { eventSource } from '../dom/event-source'
import { ElementNames, InstanceFactory, InstanceNamedFactory } from '../interface'
import {
  ROOT_STR,
  DOCUMENT_ELEMENT_NAME
} from '../constants'

import type { FormElement } from '../dom/form'
import type { TaroRootElement } from '../dom/root'
import type { TaroText } from '../dom/text'
import type { TaroNodeImpl } from '../dom-external/node-impl'
import type { TaroElementImpl } from '../dom-external/element-impl'
import type { Hooks } from '../hooks'

@injectable()
export class TaroDocument extends TaroElement {
  private _getText: InstanceFactory<TaroText>

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroNodeImpl) nodeImpl: TaroNodeImpl,
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.Hooks) hooks: Hooks,
    @inject(SERVICE_IDENTIFIER.TaroElementImpl) elementImpl: TaroElementImpl,
    @inject(SERVICE_IDENTIFIER.TaroTextFactory) getText: InstanceFactory<TaroText>
  ) {
    super(nodeImpl, getElement, hooks, elementImpl)
    this._getText = getText
    this.nodeType = NodeType.DOCUMENT_NODE
    this.nodeName = DOCUMENT_ELEMENT_NAME
  }

  public createElement (type: string): TaroElement | TaroRootElement | FormElement {
    if (type === ROOT_STR) {
      return this._getElement<TaroRootElement>(ElementNames.RootElement)()
    }

    if (controlledComponent.has(type)) {
      return this._getElement<FormElement>(ElementNames.FormElement)(type)
    }

    return this._getElement<TaroElement>(ElementNames.Element)(type)
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

  // @TODO: @PERF: 在 hydrate 移除掉空的 node
  public createComment (): TaroText {
    return this._getText('')
  }
}
