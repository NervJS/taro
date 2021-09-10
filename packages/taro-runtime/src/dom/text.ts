import { injectable } from 'inversify'
import { Shortcuts } from '@tarojs/shared'
import { TaroNode } from './node'
import { NodeType } from './node_types'

@injectable()
export class TaroText extends TaroNode {
  public _value: string
  public nodeType = NodeType.TEXT_NODE
  public nodeName = '#text'

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
