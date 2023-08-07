import { NodeType } from './node'
import { TaroTextNode } from './text'

class TaroComment extends TaroTextNode {
  constructor(data: string) {
    super(data || '', '#comment', NodeType.COMMENT_NODE)
  }
}

export { TaroComment }
