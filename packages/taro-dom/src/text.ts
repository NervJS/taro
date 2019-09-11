import { TaroNode } from './node'
import { NodeType } from './node_types'

export class Taro extends TaroNode {
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
