import { NodeType } from '@tarojs/runtime'

import TaroIcon from './icon'
import TaroText from './text'
import TaroView from './view'
import TaroLabel from './label'
import TaroInput from './input'
import TaroImage from './image'
import { TaroSwiper, TaroSwiperItem } from './swiper'
import TaroButton from './button'
import TaroSlider from './slider'
import TaroSwitch from './switch'
import TaroFeedsItem from './static'
import TaroTextArea from './textArea'
import TaroRichText from './richText'
import TaroInnerHtml from './innerHtml'
import TaroScrollView from './scrollView'
import { TaroRadio, TaroRadioGroup } from './radio'
import { TaroCheckboxGroup, TaroCheckbox } from './checkbox'
import TaroPicker from './picker'
import TaroVideo from './video'
import TaroForm from './form'
import TARO_TEMPLATES_f0t0 from './static/TARO_TEMPLATES_f0t0'

@Builder
function createNode (node: any) {
  if (node._attrs?.compileMode === 'f0t0') {
    TARO_TEMPLATES_f0t0({ node })
  } else if (node.tagName === 'VIEW') {
    TaroView({ node })
  } else if (node.tagName === 'IMAGE') {
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
  } else if (node.tagName === 'SWIPER-ITEM') {
    TaroSwiperItem({ node })
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
  } else if (node.tagName === 'LABEL') {
    TaroLabel({ node })
  } else if (node.tagName === 'PICKER') {
    TaroPicker({ node })
  } else if (node.tagName === 'FORM') {
    TaroForm({ node })
  } else if (node.tagName === 'VIDEO') {
    TaroVideo({ node })
  }
}

export { createNode }
