import { TaroNode } from './node'
import { NodeType } from './node_types'

export class TaroText extends TaroNode {
  private _value: string

  public constructor (text: string) {
    super(NodeType.TEXT_NODE, '#text')
    this._value = text
  }

  public set textContent (text: string) {
    this._value = text
    this.enqueueUpdate()
  }

  public get textContent () {
    return this._value
  }

  public set nodeValue (text: string) {
    this._value = text
    this.enqueueUpdate()
  }

  public get nodeValue () {
    return this._value
  }
}
