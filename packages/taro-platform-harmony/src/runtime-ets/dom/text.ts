import { NodeType, TaroNode } from './node'

class TextNode extends TaroNode {
  constructor(value = '', nodeName = '#text', nodeType: NodeType = NodeType.TEXT_NODE) {
    super(nodeName, nodeType)
    this.textContent = value
  }

  public get data (): string {
    return this.textContent
  }

  public set data (value: string) {
    this.textContent = value
  }
}

@Observed
export class TaroTextNode extends TextNode {}
