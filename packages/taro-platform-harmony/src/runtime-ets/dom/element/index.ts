import { Current } from '../../current'
import { TaroTextNode } from '../node'
import { isTaroCanvasElement, TaroCanvasElement } from './canvas'
import { TaroElement, isTaroElement } from './element'
import {
  FormElement,
  isTaroCheckboxElement,
  TaroCheckboxElement,
  isTaroCheckboxGroupElement,
  TaroCheckboxGroupElement,
  isTaroFormElement,
  TaroFormElement,
  isTaroInputElement,
  TaroInputElement,
  isTaroPickerElement,
  TaroPickerElement,
  isTaroRadioElement,
  TaroRadioElement,
  isTaroRadioGroupElement,
  TaroRadioGroupElement,
  isTaroSliderElement,
  TaroSliderElement,
  isTaroSwitchElement,
  TaroSwitchElement,
  isTaroTextAreaElement,
  TaroTextAreaElement,
} from './form'
import { isTaroMovableAreaElement, TaroMovableAreaElement } from './movableArea'
import { isTaroMovableViewElement, TaroMovableViewElement } from './movableView'
import {
  isTaroButtonElement,
  TaroButtonElement,
  isTaroIconElement,
  TaroIconElement,
  isTaroImageElement,
  TaroImageElement,
  isTaroLabelElement,
  TaroLabelElement,
  isTaroNavigationBarElement,
  TaroNavigationBarElement,
  isTaroOtherElement,
  TaroOtherElement,
  isTaroPageMetaElement,
  TaroPageMetaElement,
  isTaroRichTextElement,
  TaroRichTextElement,
  isTaroSwiperElement,
  TaroSwiperElement,
  isTaroSwiperItemElement,
  TaroSwiperItemElement,
  isTaroViewElement,
  TaroViewElement,
} from './normal'
import { isTaroProgressElement, TaroProgressElement } from './progress'
import { isTaroScrollViewElement, TaroScrollViewElement } from './scrollView'
import { isTaroTextElement, TaroTextElement } from './text'
import { isTaroVideoElement, TaroVideoElement } from './video'
import { isTaroInnerHtmlElement, isTaroWebViewElement, TaroInnerHtmlElement, TaroWebViewElement } from './webView'

export function initHarmonyElement() {
  Current.createHarmonyElement = (tagName: string) => {
    switch (tagName) {
      case 'view':
        return new TaroViewElement()
      case 'image':
        return new TaroImageElement()
      case 'text':
        return new TaroTextElement()
      case 'button':
        return new TaroButtonElement()
      case 'movable-area':
        return new TaroMovableAreaElement()
      case 'movable-view':
        return new TaroMovableViewElement()
      case 'progress':
        return new TaroProgressElement()
      case 'scroll-view':
        return new TaroScrollViewElement()
      case 'scroll-list':
        return new TaroScrollViewElement()
      case 'checkbox-group':
        return new TaroCheckboxGroupElement()
      case 'input':
        return new TaroInputElement()
      case 'picker':
        return new TaroPickerElement()
      case 'radio-group':
        return new TaroRadioGroupElement()
      case 'slider':
        return new TaroSliderElement()
      case 'switch':
        return new TaroSwitchElement()
      case 'video':
        return new TaroVideoElement()
      case 'checkbox':
        return new TaroCheckboxElement()
      case 'radio':
        return new TaroRadioElement()
      case 'icon':
        return new TaroIconElement()
      case 'label':
        return new TaroLabelElement()
      case 'rich-text':
        return new TaroRichTextElement()
      case 'canvas':
        return new TaroCanvasElement()
      case 'swiper':
        return new TaroSwiperElement()
      case 'swiper-item':
        return new TaroSwiperItemElement()
      case 'textarea':
        return new TaroTextAreaElement()
      case 'form':
        return new TaroFormElement()
      case 'web-view':
        return new TaroWebViewElement()
      case 'inner-html':
        return new TaroInnerHtmlElement()
      case 'page-meta':
        return new TaroPageMetaElement()
      case 'navigation-bar':
        return new TaroNavigationBarElement()
      default:
        return new TaroOtherElement(tagName)
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
  TaroWebViewElement,
}

export {
  isTaroCanvasElement,
  isTaroElement,
  isTaroCheckboxElement,
  isTaroCheckboxGroupElement,
  isTaroFormElement,
  isTaroInputElement,
  isTaroPickerElement,
  isTaroRadioElement,
  isTaroRadioGroupElement,
  isTaroSliderElement,
  isTaroSwitchElement,
  isTaroTextAreaElement,
  isTaroMovableAreaElement,
  isTaroMovableViewElement,
  isTaroButtonElement,
  isTaroIconElement,
  isTaroImageElement,
  isTaroLabelElement,
  isTaroNavigationBarElement,
  isTaroOtherElement,
  isTaroPageMetaElement,
  isTaroRichTextElement,
  isTaroSwiperElement,
  isTaroSwiperItemElement,
  isTaroViewElement,
  isTaroProgressElement,
  isTaroScrollViewElement,
  isTaroTextElement,
  isTaroVideoElement,
  isTaroInnerHtmlElement,
  isTaroWebViewElement,
}
