import { TaroNode } from './node'
import { NodeType } from './node_types'
import { Shortcuts } from '@tarojs/shared'

export class TaroText extends TaroNode {
  private _value: string

  public constructor (text: string) {
    super(NodeType.TEXT_NODE, '#text')
    this._value = text
  }

  public set textContent (text: string) {
    this._value = text
    this.enqueueUpdate({
      path: `${this._path}.${Shortcuts.Text}`,
      value: text
    })
  }

  public get textContent () {
    return this._value
  }

  public set nodeValue (text: string) {
    this.textContent = text
  }

  public get nodeValue () {
    return this._value
  }
}
