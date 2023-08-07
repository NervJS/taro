import TaroView from './view'
import TaroText from './text'
import TaroImage from './image'

@Builder
function createNode (node: any) {
  if (node.tagName === 'VIEW') {
    TaroView({ node })
  } else if (node.tagName === 'TEXT') {
    TaroText({ node })
  } else if (node.tagName === 'IMAGE') {
    TaroImage({ node })
  }
}

export { createNode }
