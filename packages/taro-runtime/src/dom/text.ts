import { inject, injectable } from 'inversify'
import { Shortcuts } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { TaroNode } from './node'
import { NodeType } from './node_types'

import type { TaroNodeImpl } from '../dom-external/node-impl'
import type { InstanceNamedFactory } from '../interface'
import type { Hooks } from '../hooks'

@injectable()
export class TaroText extends TaroNode {
  public _value: string

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroNodeImpl) nodeImpl: TaroNodeImpl,
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.Hooks) hooks: Hooks
  ) {
    super(nodeImpl, getElement, hooks)
    this.nodeType = NodeType.TEXT_NODE
    this.nodeName = '#text'
  }

  public set textContent (text: string) {
    this._value = text
    this.enqueueUpdate({
      path: `${this._path}.${Shortcuts.Text}`,
      value: text
    })
  }

  public get textContent (): string {
    return this._value
  }

  public set nodeValue (text: string) {
    this.textContent = text
  }

  public get nodeValue (): string {
    return this._value
  }
}
