import {
  TaroButtonElement as _TaroButtonElement,
  TaroCheckboxGroupElement as _TaroCheckboxGroupElement,
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
  FormElement as _FormElement,
  Current
} from '@tarojs/runtime'

@Observed
class TaroElement extends _TaroElement {
  constructor(tagName: string) {
    super(tagName)
  }
}

@Observed
class TaroViewElement extends _TaroViewElement {}

@Observed
class TaroTextElement extends _TaroTextElement {}

@Observed
class TaroImageElement extends _TaroImageElement {}

@Observed
class TaroButtonElement extends _TaroButtonElement {}

@Observed
class TaroFormWidgetElement extends _TaroFormWidgetElement {}

@Observed
class TaroInputElement extends _TaroInputElement {}

@Observed
class TaroSliderElement extends _TaroSliderElement {}

@Observed
class TaroSwitchElement extends _TaroSwitchElement {}

@Observed
class TaroCheckboxGroupElement extends _TaroCheckboxGroupElement {}

@Observed
class TaroRadioGroupElement extends _TaroRadioGroupElement {}

@Observed
class TaroPickerElement extends _TaroPickerElement {}

@Observed
class TaroVideoElement extends _TaroVideoElement {}

@Observed
class TaroIgnoreElement extends _TaroIgnoreElement {}

@Observed
class FormElement extends _FormElement {}


export function initHarmonyElement () {
  Current.createHarmonyElement = (tagName: string) => {
    switch (tagName) {
      case 'button': return new TaroButtonElement()
      case 'checkbox-group': return new TaroCheckboxGroupElement()
      case 'ignore': return new TaroIgnoreElement()
      case 'image': return new TaroImageElement()
      case 'input': return new TaroInputElement()
      case 'picker': return new TaroPickerElement()
      case 'radio-group': return new TaroRadioGroupElement()
      case 'slider': return new TaroSliderElement()
      case 'switch': return new TaroSwitchElement()
      case 'text': return new TaroTextElement()
      case 'video': return new TaroVideoElement()
      case 'view': return new TaroViewElement()
      default: return new TaroElement(tagName)
    }
  }
}

export {
  TaroButtonElement,
  TaroCheckboxGroupElement,
  TaroElement,
  TaroIgnoreElement,
  TaroImageElement,
  TaroInputElement,
  TaroPickerElement,
  TaroRadioGroupElement,
  TaroSliderElement,
  TaroSwitchElement,
  TaroTextElement,
  TaroVideoElement,
  TaroViewElement
}
