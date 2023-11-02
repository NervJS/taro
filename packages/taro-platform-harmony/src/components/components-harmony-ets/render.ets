import { NodeType } from '@tarojs/runtime'

import TaroIcon from './icon'
import TaroText from './text'
import TaroView from './view'
import TaroInput from './input'
import TaroImage from './image'
import TaroSwiper from './swiper'
import TaroButton from './button'
import TaroSlider from './slider'
import TaroSwitch from './switch'
import TaroTextArea from './textArea'
import TaroRichText from './richText'
import TaroInnerHtml from './innerHtml'
import TaroScrollView from './scrollView'
import { TaroCheckboxGroup, TaroCheckbox } from './checkbox'
import { TaroRadio, TaroRadioGroup } from './radio'

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
  } else if (node.tagName === 'INPUT') {
    TaroInput({ node })
  } else if (node.tagName === 'SWIPER') {
    TaroSwiper({ node })
  } else if (node.tagName === 'INNER-HTML') {
    TaroInnerHtml({ node })
  } else if (node.tagName === 'RICH-TEXT') {
    TaroRichText({ node })
  } else if (node.tagName === 'ICON') {
    TaroIcon({ node })
  } else if (node.tagName === 'TEXTAREA') {
    TaroTextArea({ node })
  } else if (node.tagName === 'CHECKBOX-GROUP') {
    TaroCheckboxGroup({ node })
  } else if (node.tagName === 'CHECKBOX') {
    TaroCheckbox({ node })
  } else if (node.tagName === 'RADIO-GROUP') {
    TaroRadioGroup({ node })
  } else if (node.tagName === 'RADIO') {
    TaroRadio({ node })
  } else {
    TaroView({ node })
  }
}

export { createNode }
