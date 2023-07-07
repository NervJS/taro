import { NodeType } from './Node'
import { TaroTextNode } from './Text'

class TaroComment extends TaroTextNode {
  constructor(data: string) {
    super(data || '', '#comment', NodeType.COMMENT_NODE)
  }
}

export { TaroComment }