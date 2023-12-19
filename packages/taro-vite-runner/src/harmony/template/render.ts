import BaseParser from './base'

export default class RenderParser extends BaseParser {
  constructor (
    protected template: Map<string, string>
  ) {
    super()
  }

  generate () {
    const renderContent = `import TaroImage from './image'
import TaroText from './text'
import TaroView from './view'
import TaroIcon from './icon'
import TaroForm from './form'
import TaroLabel from './label'
import TaroInput from './input'
import TaroVideo from './video'
import TaroButton from './button'
import TaroPicker from './picker'
import TaroSlider from './slider'
import TaroSwitch from './switch'
import TaroSwiper from './swiper'
import TaroTextArea from './textArea'
import TaroRichText from './richText'
import TaroInnerHtml from './innerHtml'
import TaroScrollView from './scrollView'
import { TaroRadio, TaroRadioGroup } from './radio'
import { TaroCheckboxGroup, TaroCheckbox } from './checkbox'
${this.generateRenderImport()}
import { NodeType } from '../runtime'

import type {
  TaroViewElement,
  TaroElement,
  TaroImageElement,
  TaroButtonElement,
  TaroTextElement,
  TaroCheckboxElement,
  TaroFormElement,
  TaroIconElement,
  TaroLabelElement, 
  TaroPickerElement, 
  TaroRadioElement,
  TaroRichTextElement,
  TaroRadioGroupElement, 
  TaroInputElement, 
  TaroCheckboxGroupElement,
  TaroTextAreaElement,
  TaroVideoElement,
  // TaroSwiperItemElement,
  TaroSwiperElement,
  TaroSwitchElement,
  TaroSliderElement,
  TaroScrollViewElement,
} from '../runtime'

@Builder
function createChildItem (item: TaroElement) {
  ${this.generateRenderCondition()}if (item.tagName === 'VIEW') {
    TaroView(item as TaroViewElement)
  } else if (item.tagName === 'TEXT' || item.nodeType === NodeType.TEXT_NODE) {
    TaroText(item as TaroTextElement)
  } else if (item.tagName === 'IMAGE') {
    TaroImage(item as TaroImageElement)
  } else if (item.tagName === 'BUTTON') {
    TaroButton(item as TaroButtonElement)
  } else if (item.tagName === 'SCROLL-VIEW') {
    TaroScrollView(item as TaroScrollViewElement)
  } else if (item.tagName === 'SLIDER') {
    TaroSlider({ node: item as TaroSliderElement })
  } else if (item.tagName === 'SWITCH') {
    TaroSwitch(item as TaroSwitchElement)
  } else if (item.tagName === 'INPUT') {
    TaroInput(item as TaroInputElement)
  } else if (item.tagName === 'SWIPER') {
    TaroSwiper(item as TaroSwiperElement)
  } else if (item.tagName === 'SWIPER-ITEM') {
    TaroView(item as TaroViewElement)
  } else if (item.tagName === 'INNER-HTML') {
    TaroInnerHtml(item as TaroViewElement)
  } else if (item.tagName === 'RICH-TEXT') {
    TaroRichText(item as TaroRichTextElement)
  } else if (item.tagName === 'ICON') {
    TaroIcon(item as TaroIconElement)
  } else if (item.tagName === 'TEXT-AREA') {
    TaroTextArea(item as TaroTextAreaElement)
  } else if (item.tagName === 'CHECKBOX-GROUP') {
    TaroCheckboxGroup({ node: item as TaroCheckboxGroupElement })
  } else if (item.tagName === 'CHECKBOX') {
    TaroCheckbox(item as TaroCheckboxElement)
  } else if (item.tagName === 'RADIO-GROUP') {
    TaroRadioGroup({ node: item as TaroRadioGroupElement })
  } else if (item.tagName === 'RADIO') {
    TaroRadio(item as TaroRadioElement)
  } else if (item.tagName === 'LABEL') {
    TaroLabel(item as TaroLabelElement)
  } else if (item.tagName === 'PICKER') {
    TaroPicker({ node: item as TaroPickerElement })
  } else if (item.tagName === 'FORM') {
    TaroForm(item as TaroFormElement)
  } else if (item.tagName === 'VIDEO') {
    TaroVideo(item as TaroVideoElement)
  } else {
    TaroView(item as TaroViewElement)
  }
}

function getTop (node: TaroElement): Length | number {
  return node?.hmStyle?.top || 0
}

function getLeft (node: TaroElement): Length | number {
  return node?.hmStyle?.left || 0
}

@Builder
function createChildItemWithPosition (item: TaroElement) {
  if (item?.hmStyle?.position === 'absolute' || item?.hmStyle?.position === 'fixed') {
    Stack({ alignContent: Alignment.TopStart }) {
      createChildItem(item)
    }
    .position({
      x: getLeft(item),
      y: getTop(item)
    })
    .id(item?._attrs?.id || item?._nid)
    .key(item?._attrs?.id || item?._nid)
    .zIndex(Number(item?.hmStyle?.zIndex) || null)
  } else if ((item?.hmStyle?.position === 'relative')) {
    Stack({ alignContent: Alignment.TopStart }) {
      createChildItem(item)
    }
    .offset({
      x: getLeft(item),
      y: getTop(item)
    })
    .id(item?._attrs?.id || item?._nid)
    .key(item?._attrs?.id || item?._nid)
    .zIndex(Number(item?.hmStyle?.zIndex) || null)
  } else {
    createChildItem(item)
  }
}

@Builder
function createLazyChildren (node: TaroElement) {
  LazyForEach(node, (item: TaroElement) => {
    createChildItemWithPosition(item)
  }, (item: TaroElement) => \`\${item._nid}\${item._updateTrigger}\`)
}

export { createChildItem, createChildItemWithPosition, createLazyChildren }
`

    return renderContent
  }

  generateRenderImport () {
    let result = ''

    this.template.forEach((_, key) => {
      result = `${result}import ${key} from './static/${key}'\n`
    })

    return result
  }

  generateRenderCondition () {
    let result = ''
    
    this.template.forEach((_, key) => {
      const keyData = key.split('_')
      const name = keyData[keyData.length - 1]
      result = `${result}if (node._attrs?.compileMode === '${name}') {
    ${key}({ node: node as TaroViewElement })
  } else `
    })

    return result
  }
}
