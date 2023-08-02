import { NodeType } from './node'
import { TaroTextElement } from './text'

class TaroComment extends TaroTextElement {
  constructor(data: string) {
    super(data || '', '#comment', NodeType.COMMENT_NODE)
  }
}

export { TaroComment }
