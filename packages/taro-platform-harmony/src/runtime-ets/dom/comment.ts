import { NodeType, TaroTextNode } from './node'

class TaroComment extends TaroTextNode {
  constructor(data: string) {
    super(data || '', '#comment', NodeType.COMMENT_NODE)
  }
}

export { TaroComment }
