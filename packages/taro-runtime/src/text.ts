import { TaroNode } from './node'
import { NodeType } from './node_types'

export class TaroText extends TaroNode {
  public nodeValue: string

  public constructor (text: string) {
    super(NodeType.TEXT_NODE, '#text')
    this.nodeValue = text
  }

  public set textContent (text: string) {
    this.nodeValue = text
    this.enqueueUpdate()
  }

  public get textContent () {
    return this.nodeValue
  }
}
