import { NodeType } from '@tarojs/runtime'

import TaroImage from './image'
import TaroText from './text'
import TaroView from './view'
import TaroButton from './button'
import TaroScrollView from './scrollView'


@Builder
function createNode (node: any) {
  if (node.tagName === 'IMAGE') {
    TaroImage({ node })
  } else if (node.tagName === 'TEXT') {
    TaroText({ node })
  } else if (node.tagName === 'SCROLL-VIEW') {
    TaroScrollView({ node })
  } else if (node.tagName === 'BUTTON') {
    TaroButton({ node })
  } else if (node.nodeType === NodeType.TEXT_NODE) {
    TaroText({ node })
  } else {
    TaroView({ node })
  }
}

export { createNode }
