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
  TaroPickerElement,
  TaroRadioElement,
  TaroRadioGroupElement,
  TaroSliderElement,
  TaroSwitchElement,
  TaroTextAreaElement
} from './form'
import { TaroMovableAreaElement } from './movableArea'
import { isTaroMovableViewElement, TaroMovableViewElement } from './movableView'
import {
  TaroButtonElement,
  TaroIconElement,
  TaroImageElement,
  TaroLabelElement,
  TaroNavigationBarElement,
  TaroOtherElement,
  TaroPageMetaElement,
  TaroRichTextElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroViewElement
} from './normal'
import { TaroProgressElement } from './progress'
import { TaroScrollViewElement } from './scrollView'
import { TaroTextElement } from './text'
import { TaroVideoElement } from './video'
import { TaroInnerHtmlElement, TaroWebViewElement } from './webView'

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
  TaroWebViewElement
}


export {
  isTaroMovableViewElement
}
