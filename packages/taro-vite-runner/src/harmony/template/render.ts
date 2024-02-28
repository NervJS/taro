import path from 'path'

import BaseParser from './base'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'

export default class RenderParser extends BaseParser {
  constructor (
    protected template: Map<string, string>,
    protected context: ViteHarmonyCompilerContext
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
import TaroWebView from './webview'
import TaroTextArea from './textArea'
import TaroRichText from './richText'
import TaroProgress from './progress'
import TaroInnerHtml from './innerHtml'
import TaroScrollView from './scrollView'
import TaroMovableArea from './movableArea'
import TaroMovableView from './movableView'
import { TaroRadio, TaroRadioGroup } from './radio'
import { TaroCheckboxGroup, TaroCheckbox } from './checkbox'
${this.generateRenderNativeImport()}${this.generateRenderCompileModeImport()}
import { NodeType } from '../runtime'

import type {
  TaroAny,
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
  TaroProgressElement,
  TaroMovableAreaElement,
  TaroMovableViewElement,
  TaroSwiperElement,
  TaroSwitchElement,
  TaroSliderElement,
  TaroScrollViewElement,
  TaroWebViewElement
} from '../runtime'

@Builder
function createChildItem (item: TaroElement) {
  ${this.generateRenderNativeCondition()}${this.generateRenderCompileModeCondition()}if (item.tagName === 'VIEW') {
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
    TaroSwitch({ node: item as TaroSwitchElement })
  } else if (item.tagName === 'INPUT') {
    TaroInput({ node: item as TaroInputElement })
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
    TaroTextArea({ node: item as TaroTextAreaElement })
  } else if (item.tagName === 'CHECKBOX-GROUP') {
    TaroCheckboxGroup({ node: item as TaroCheckboxGroupElement })
  } else if (item.tagName === 'CHECKBOX') {
    TaroCheckbox({ node: item as TaroCheckboxElement })
  } else if (item.tagName === 'RADIO-GROUP') {
    TaroRadioGroup({ node: item as TaroRadioGroupElement })
  } else if (item.tagName === 'PROGRESS') {
    TaroProgress({node: item as  TaroProgressElement })
  } else if (item.tagName === 'MOVABLEVIEW') {
    TaroMovableView(item as TaroMovableViewElement)
  } else if (item.tagName === 'MOVABLEAREA') {
    TaroMovableArea(item as TaroMovableAreaElement)
  } else if (item.tagName === 'RADIO') {
    TaroRadio({ node: item as TaroRadioElement })
  } else if (item.tagName === 'LABEL') {
    TaroLabel(item as TaroLabelElement)
  } else if (item.tagName === 'PICKER') {
    TaroPicker({ node: item as TaroPickerElement })
  } else if (item.tagName === 'FORM') {
    TaroForm(item as TaroFormElement)
  } else if (item.tagName === 'VIDEO') {
    TaroVideo(item as TaroVideoElement)
  } else if (item.tagName === 'WEB-VIEW') {
    TaroWebView(item as TaroWebViewElement)
  } else {
    TaroView(item as TaroViewElement)
  }
}

@Builder
function createLazyChildren (node: TaroElement) {
  LazyForEach(node, (item: TaroElement) => {
    createChildItem(item)
  }, (item: TaroElement) => \`\${item._nid}\${item._updateTrigger}\`)
}

export { createChildItem, createLazyChildren }
`

    return renderContent
  }

  generateRenderCompileModeImport () {
    let result = ''

    this.template.forEach((_, key) => {
      result = `${result}import ${key} from './static/${key}'\n`
    })

    return result
  }

  generateRenderNativeImport () {
    let result = ''

    this.context.nativeComponents.forEach((nativeMeta, _) => {
      const nativePath = path.relative(this.context.sourceDir, nativeMeta.scriptPath)
      result = `${result}import ${nativeMeta.name} from '../../../${nativePath}'\n`
    })

    return result
  }

  generateRenderCompileModeCondition () {
    let result = ''
    
    this.template.forEach((_, key) => {
      const keyData = key.split('_')
      const name = keyData[keyData.length - 1]
      result = `${result}if (item._attrs?.compileMode === '${name}') {
    ${key}({ node: item as TaroViewElement })
  } else `
    })

    return result
  }

  generateRenderNativeCondition () {
    let result = ''

    this.context.nativeComponents.forEach((nativeMeta, _) => {
      const { name } = nativeMeta
      result = `${result}if (item.tagName === '${name.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase()}') {
    ${name}({ props: (item._attrs as TaroAny).props })
  } else `
    })

    return result
  }
}
