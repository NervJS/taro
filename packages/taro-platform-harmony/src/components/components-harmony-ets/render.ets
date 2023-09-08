import TaroImage from './image'
import TaroText from './text'
import TaroView from './view'
import TaroScrollView from './scrollView'

@Builder
function createNode (node: any) {
  if (node.tagName === 'IMAGE') {
    TaroImage({ node })
  } else if (node.tagName === 'TEXT') {
    TaroText({ node })
  } else if (node.tagName === 'SCROLL-VIEW') {
    TaroScrollView({ node })
  } else {
    TaroView({ node })
  }
}

export { createNode }
