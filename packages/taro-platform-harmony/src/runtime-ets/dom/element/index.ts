import { Current } from '../../current'
import { TaroTextNode } from '../node'
import { TaroElement } from './element'
import {
  FormElement,
  TaroCheckboxGroupElement,
  TaroFormElement,
  TaroFormWidgetElement,
  TaroInputElement,
  TaroPickerElement,
  TaroRadioGroupElement
} from './form'
import {
  TaroButtonElement,
  TaroCheckboxElement,
  TaroIconElement,
  TaroImageElement,
  TaroLabelElement,
  TaroRadioElement,
  TaroRichTextElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroTextAreaElement,
  TaroTextElement,
  TaroViewElement
} from './normal'
import { TaroScrollViewElement } from './scrollView'
import { TaroSliderElement } from './slider'
import { TaroSwitchElement } from './switch'
import { TaroVideoElement } from './video'

export function initHarmonyElement () {
  Current.createHarmonyElement = (tagName: string) => {
    switch (tagName) {
      case 'view': return new TaroViewElement()
      case 'image': return new TaroImageElement()
      case 'text': return new TaroTextElement()
      case 'button': return new TaroButtonElement()
      case 'scroll-view': return new TaroScrollViewElement()
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
      case 'swiper': return new TaroSwiperElement()
      case 'swiper-item': return new TaroSwiperItemElement()
      case 'text-area': return new TaroTextAreaElement()
      case 'form': return new TaroFormElement()
      default: return new TaroElement(tagName)
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
  TaroCheckboxElement,
  TaroCheckboxGroupElement,
  TaroElement,
  TaroFormElement,
  TaroFormWidgetElement,
  TaroIconElement,
  TaroImageElement,
  TaroInputElement,
  TaroLabelElement,
  TaroPickerElement,
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
  TaroViewElement
}
