import View from './view'
import Text from './text'
import Image from './image'

@Builder
function createNode (node: any) {
  if (node.tagName === 'VIEW') {
    View({ node })
  } else if (node.tagName === 'TEXT') {
    Text({ node })
  } else if (node.tagName === 'IMAGE') {
    Image({ node })
  }
}

export { createNode }
