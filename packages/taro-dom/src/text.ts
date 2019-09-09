import { MpNode } from './node'
import { NodeType } from './node_types'

export class MpText extends MpNode {
  public nodeValue: string

  public constructor (text: string) {
    super(NodeType.TEXT_NODE, '#text')
    this.nodeValue = text
  }

  public set textContent (text: string) {
    this.nodeValue = text
    this.performUpdate()
  }

  public get textContent () {
    return this.nodeValue
  }
}
