import {
  TaroButtonElement as _TaroButtonElement,
  TaroCheckboxGroupElement as _TaroCheckboxGroupElement,
  TaroScrollViewElement as _TaroScrollViewElement,
  TaroElement as _TaroElement,
  TaroFormWidgetElement as _TaroFormWidgetElement,
  TaroIgnoreElement as _TaroIgnoreElement,
  TaroImageElement as _TaroImageElement,
  TaroInputElement as _TaroInputElement,
  TaroPickerElement as _TaroPickerElement,
  TaroRadioGroupElement as _TaroRadioGroupElement,
  TaroSliderElement as _TaroSliderElement,
  TaroSwitchElement as _TaroSwitchElement,
  TaroTextElement as _TaroTextElement,
  TaroVideoElement as _TaroVideoElement,
  TaroViewElement as _TaroViewElement,
  TaroCheckboxElement as _TaroCheckboxElement,
  TaroRadioElement as _TaroRadioElement,
  TaroIconElement as _TaroIconElement,
  TaroLabelElement as _TaroLabelElement,
  TaroRichTextElement as _TaroRichTextElement,
  TaroSwiperElement as _TaroSwiperElement,
  TaroSwiperItemElement as _TaroSwiperItemElement,
  TaroTextAreaElement as _TaroTextAreaElement,
  FormElement as _FormElement,
  Current,
  TaroAny
} from '@tarojs/runtime'

import { TaroCheckbox, TaroCheckboxGroup } from './checkbox'
import { TaroRadio, TaroRadioGroup } from './radio'
import TaroButton from './button'
import TaroView from './view'
import TaroForm from './form'
import TaroIcon from './icon'
import TaroText from './text'
import TaroImage from './image'
import TaroInput from './input'
import TaroScrollView from './scrollView'
import TaroTextArea from './textArea'
import TaroRichText from './richText'
import TaroLabel from './label'
import TaroVideo from './video'
import TaroPicker from './picker'
import TaroSwitch from './switch'
import TaroSlider from './slider'
import { TaroSwiper } from './swiper'

@Observed
class TaroElement extends _TaroElement {
  constructor(tagName: string) {
    super(tagName)
  }
  declare public _instance: TaroAny
}

@Observed
class TaroViewElement extends _TaroViewElement {
  declare public _instance: TaroView
}

@Observed
class TaroTextElement extends _TaroTextElement {
  declare public _instance: TaroText
}

@Observed
class TaroImageElement extends _TaroImageElement {
  declare public _instance: TaroImage
}

@Observed
class TaroScrollViewElement extends _TaroScrollViewElement {
  declare public _instance: TaroScrollView
}

@Observed
class TaroButtonElement extends _TaroButtonElement {
  declare public _instance: TaroButton
}

@Observed
class TaroInputElement extends _TaroInputElement {
  declare public _instance: TaroInput
}

@Observed
class TaroSliderElement extends _TaroSliderElement {
  declare public _instance: TaroSlider
}

@Observed
class TaroSwitchElement extends _TaroSwitchElement {
  declare public _instance: TaroSwitch
}

@Observed
class TaroCheckboxGroupElement extends _TaroCheckboxGroupElement {
  declare public _instance: TaroCheckboxGroup
}

@Observed
class TaroRadioGroupElement extends _TaroRadioGroupElement {
  declare public _instance: TaroRadioGroup
}

@Observed
class TaroPickerElement extends _TaroPickerElement {
  declare public _instance: TaroPicker
}

@Observed
class TaroVideoElement extends _TaroVideoElement {
  declare public _instance: TaroVideo
}

@Observed
class TaroCheckboxElement extends _TaroCheckboxElement{
  declare public _instance: TaroCheckbox
}

@Observed
class TaroRadioElement extends _TaroRadioElement{
  declare public _instance: TaroRadio
}

@Observed
class TaroIconElement extends _TaroIconElement{
  declare public _instance: TaroIcon
}

@Observed
class TaroLabelElement extends _TaroLabelElement{
  declare public _instance: TaroLabel
}

@Observed
class TaroRichTextElement extends _TaroRichTextElement{
  declare public _instance: TaroRichText
}

@Observed
class TaroSwiperElement extends _TaroSwiperElement{
  declare public _instance: TaroSwiper
}

@Observed
class TaroSwiperItemElement extends _TaroSwiperItemElement{
  declare public _instance: TaroSwiper
}

@Observed
class TaroTextAreaElement extends _TaroTextAreaElement{
  declare public _instance: TaroTextArea
}

@Observed
class TaroFormElement extends _FormElement {
  declare public _instance: TaroForm
}

@Observed
class TaroFormWidgetElement extends _TaroFormWidgetElement {}

@Observed
class TaroIgnoreElement extends _TaroIgnoreElement {}

export function initHarmonyElement () {
  Current.createHarmonyElement = (tagName: string) => {
    switch (tagName) {
      case 'view': return new TaroViewElement()
      case 'image': return new TaroImageElement()
      case 'text': return new TaroTextElement()
      case 'button': return new TaroButtonElement()
      case 'scroll-view': return new TaroScrollViewElement()
      case 'checkbox-group': return new TaroCheckboxGroupElement()
      case 'ignore': return new TaroIgnoreElement()
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
}

export {
  TaroButtonElement,
  TaroCheckboxGroupElement,
  TaroElement,
  TaroScrollViewElement,
  TaroFormWidgetElement,
  TaroIgnoreElement,
  TaroImageElement,
  TaroInputElement,
  TaroPickerElement,
  TaroRadioGroupElement,
  TaroSliderElement,
  TaroSwitchElement,
  TaroTextElement,
  TaroVideoElement,
  TaroViewElement,
  TaroCheckboxElement,
  TaroRadioElement,
  TaroIconElement,
  TaroLabelElement,
  TaroRichTextElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroTextAreaElement,
  TaroFormElement
}
