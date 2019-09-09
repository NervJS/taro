import { MpNode } from './node'
import { NodeType } from './node_types'
import { requestUpdate } from './render'

export class MpText extends MpNode {
  public nodeValue: string

  public constructor (text: string) {
    super(NodeType.TEXT_NODE, '#text')
    this.nodeValue = text
  }

  public set textContent (text: string) {
    this.nodeValue = text
    requestUpdate(this)
  }

  public get textContent () {
    return this.nodeValue
  }
}
