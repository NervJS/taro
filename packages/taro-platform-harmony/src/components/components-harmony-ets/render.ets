import { NodeType } from '@tarojs/runtime'

import TaroImage from './image'
import TaroText from './text'
import TaroView from './view'
import TaroButton from './button'
import TaroScrollView from './scrollView'
import TaroSlider from './slider'
import TaroSwitch from './switch'

@Builder
function createNode (node: any) {
  if (node.tagName === 'IMAGE') {
    TaroImage({ node })
  } else if (node.tagName === 'TEXT' || node.nodeType === NodeType.TEXT_NODE) {
    TaroText({ node })
  } else if (node.tagName === 'BUTTON') {
    TaroButton({ node })
  } else if (node.tagName === 'SCROLL-VIEW') {
    TaroScrollView({ node })
  } else if (node.tagName === 'SLIDER') {
    TaroSlider({ node })
  } else if (node.tagName === 'SWITCH') {
    TaroSwitch({ node })
  } else {
    TaroView({ node })
  }
}

export { createNode }
