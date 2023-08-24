import TaroImage from './image'
import TaroText from './text'
import TaroView from './view'

@Builder
function createNode (node: any) {
  if (node.tagName === 'IMAGE') {
    TaroImage({ node })
  } else if (node.tagName === 'TEXT') {
    TaroText({ node })
  } else {
    TaroView({ node })
  }
}

export { createNode }
