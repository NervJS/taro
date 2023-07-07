import TaroView from './View'
import TaroText from './Text'
import TaroImage from './Image'

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
