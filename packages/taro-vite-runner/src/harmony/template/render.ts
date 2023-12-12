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
import TaroButton from './button'
import TaroIcon from './icon'
// import TaroForm from './form'
// import TaroLabel from './label'
// import TaroInput from './input'
// import TaroVideo from './video'
// import TaroPicker from './picker'
// import TaroSlider from './slider'
// import TaroSwitch from './switch'
// import TaroTextArea from './textArea'
// import TaroRichText from './richText'
// import TaroInnerHtml from './innerHtml'
// import TaroScrollView from './scrollView'
// import { TaroRadio, TaroRadioGroup } from './radio'
// import { TaroSwiper, TaroSwiperItem } from './swiper'
// import { TaroCheckboxGroup, TaroCheckbox } from './checkbox'

${this.generateRenderImport()}
import { NodeType, convertNumber2VP } from '../runtime'
import { AttributeManager } from './utils/AttributeManager'
import type {
  TaroViewElement,
  TaroElement,
  TaroImageElement,
  TaroButtonElement
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
  TaroSwiperItemElement,
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
  } else if (node.tagName === 'SCROLL-VIEW') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'SLIDER') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'SWITCH') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'INPUT') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'SWIPER') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'SWIPER-ITEM') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'INNER-HTML') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'RICH-TEXT') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'ICON') {
    TaroIcon(item as TaroIconElement)
  } else if (node.tagName === 'TEXTAREA') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'CHECKBOX-GROUP') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'CHECKBOX') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'RADIO-GROUP') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'RADIO') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'LABEL') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'PICKER') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'FORM') {
    TaroView(item as TaroViewElement)
  } else if (node.tagName === 'VIDEO') {
    TaroView(item as TaroViewElement)
  } else {
    TaroView(item as TaroViewElement)
  }
}

@Builder
function createChildItemWithPosition (item: TaroElement) {
  if (item?._st?.position === 'absolute' || item?._st?.position === 'fixed') {
    Stack({ alignContent: Alignment.TopStart }) {
      createChildItem(item)
    }
    .position({
      x: AttributeManager.getStyleAfterConvert(item?._st, 'left') || convertNumber2VP(AttributeManager.getNodeStyle(item?._st, 'left') || 0),
      y: AttributeManager.getStyleAfterConvert(item?._st, 'top') || convertNumber2VP(AttributeManager.getNodeStyle(item?._st, 'top') || 0)
    })
    .id(item?._attrs?.id || item?._nid)
    .key(item?._attrs?.id || item?._nid)
    .zIndex(Number(item?._st?.zIndex) || null)
  } else if ((item?._st?.position === 'relative')) {
    Stack({ alignContent: Alignment.TopStart }) {
      createChildItem(item)
    }
    .offset({
      x: AttributeManager.getStyleAfterConvert(item?._st, 'left') || convertNumber2VP(AttributeManager.getNodeStyle(item?._st, 'left') || 0),
      y: AttributeManager.getStyleAfterConvert(item?._st, 'top') || convertNumber2VP(AttributeManager.getNodeStyle(item?._st, 'top') || 0)
    })
    .id(item?._attrs?.id || item?._nid)
    .key(item?._attrs?.id || item?._nid)
    .zIndex(Number(item?._st?.zIndex) || null)
  } else {
    createChildItem(item)
  }
}

@Builder
function createLazyChildren (node: TaroElement) {
  LazyForEach(node, (item: TaroElement) => {
    createChildItemWithPosition(item)
  }, (item: TaroElement) => item._nid)
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
