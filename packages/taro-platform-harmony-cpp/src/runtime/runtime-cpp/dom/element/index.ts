import { Current } from '../../current'
import { TaroTextNode } from '../node'
import { TaroCanvasElement } from './canvas'
import { TaroElement } from './element'
import {
  FormElement,
  TaroCheckboxElement,
  TaroCheckboxGroupElement,
  TaroFormElement,
  TaroInputElement,
  TaroLabelElement,
  TaroPickerElement,
  TaroRadioElement,
  TaroRadioGroupElement,
  TaroRichTextElement,
  TaroSliderElement,
  TaroSwitchElement,
  TaroTextAreaElement,
} from './form'
import { isTaroMovableViewElement, TaroMovableAreaElement, TaroMovableViewElement } from './movable'
import {
  TaroButtonElement,
  TaroFlowItemElement,
  TaroFlowSectionElement,
  TaroIconElement,
  TaroImageElement,
  TaroListElement,
  TaroNavigationBarElement,
  TaroOtherElement,
  TaroPageMetaElement,
  TaroProgressElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroViewElement,
  TaroWaterFlowElement,
} from './normal'
import { TaroScrollViewElement } from './scroll_view'
import { TaroTextElement } from './text'
import { TaroVideoElement } from './video'
import { TaroInnerHtmlElement, TaroWebViewElement } from './web_view'

export function initHarmonyElement () {
  Current.createHarmonyElement = (tagName: string) => {
    switch (tagName) {
      case 'view': return new TaroViewElement()
      case 'image': return new TaroImageElement()
      case 'text': return new TaroTextElement()
      case 'button': return new TaroButtonElement()
      case 'movable-area': return new TaroMovableAreaElement()
      case 'movable-view': return new TaroMovableViewElement()
      case 'progress': return new TaroProgressElement()
      case 'scroll-view': return new TaroScrollViewElement()
      case 'scroll-list': return new TaroScrollViewElement()
      case 'checkbox-group': return new TaroCheckboxGroupElement()
      case 'input': return new TaroInputElement()
      case 'picker': return new TaroPickerElement()
      case 'radio-group': return new TaroRadioGroupElement()
      case 'slider': return new TaroSliderElement()
      case 'switch': return new TaroSwitchElement()
      case 'video': return new TaroVideoElement()
      case 'checkbox': return new TaroCheckboxElement()
      case 'radio': return new TaroRadioElement()
      case 'icon': return new TaroIconElement()
      case 'label': return new TaroLabelElement()
      case 'rich-text': return new TaroRichTextElement()
      case 'canvas': return new TaroCanvasElement()
      case 'swiper': return new TaroSwiperElement()
      case 'swiper-item': return new TaroSwiperItemElement()
      case 'textarea': return new TaroTextAreaElement()
      case 'form': return new TaroFormElement()
      case 'web-view': return new TaroWebViewElement()
      case 'inner-html': return new TaroInnerHtmlElement()
      case 'page-meta': return new TaroPageMetaElement()
      case 'navigation-bar': return new TaroNavigationBarElement()
      case 'water-flow': return new TaroWaterFlowElement()
      case 'flow-section': return new TaroFlowSectionElement()
      case 'flow-item': return new TaroFlowItemElement()
      case 'list': return new TaroListElement()
      default: return new TaroOtherElement(tagName)
    }
  }

  Current.createTextNode = (value: string): TaroTextNode => {
    const node = new TaroTextNode(value)
    return node
  }
}

export {
  FormElement,
  TaroButtonElement,
  TaroCanvasElement,
  TaroCheckboxElement,
  TaroCheckboxGroupElement,
  TaroElement,
  TaroFlowItemElement,
  TaroFlowSectionElement,
  TaroFormElement,
  TaroIconElement,
  TaroImageElement,
  TaroInnerHtmlElement,
  TaroInputElement,
  TaroLabelElement,
  TaroMovableAreaElement,
  TaroMovableViewElement,
  TaroNavigationBarElement,
  TaroOtherElement,
  TaroPageMetaElement,
  TaroPickerElement,
  TaroProgressElement,
  TaroRadioElement,
  TaroRadioGroupElement,
  TaroRichTextElement,
  TaroScrollViewElement,
  TaroSliderElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroSwitchElement,
  TaroTextAreaElement,
  TaroTextElement,
  TaroVideoElement,
  TaroViewElement,
  TaroWaterFlowElement,
  TaroWebViewElement
}

export {
  isTaroMovableViewElement
}
