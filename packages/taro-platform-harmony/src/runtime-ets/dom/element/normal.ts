
import { TaroElement } from './element'

import type {
  ButtonProps,
  CheckboxProps,
  IconProps,
  ImageProps,
  LabelProps,
  RadioProps,
  RichTextProps,
  SwiperItemProps,
  SwiperProps,
  TextareaProps,
  TextProps,
  ViewProps
} from '../../../components/types'

class TaroViewElement extends TaroElement<ViewProps> {
  constructor() {
    super('View')
  }
}

class TaroTextElement extends TaroElement<TextProps> {
  constructor() {
    super('Text')
  }
}

class TaroImageElement extends TaroElement<ImageProps> {
  constructor() {
    super('Image')
  }
}

class TaroButtonElement extends TaroElement<ButtonProps> {
  constructor() {
    super('Button')
  }
}

class TaroCheckboxElement extends TaroElement<CheckboxProps>{
  checked = false
  
  constructor() {
    super('Checkbox')
  }
}

class TaroRadioElement extends TaroElement<RadioProps>{
  checked = false

  constructor() {
    super('Radio')
  }

  public group?: string
}

class TaroIconElement extends TaroElement<IconProps>{
  constructor() {
    super('Icon')
  }
}

class TaroLabelElement extends TaroElement<LabelProps>{
  constructor() {
    super('Label')
  }
}

class TaroRichTextElement extends TaroElement<RichTextProps>{
  constructor() {
    super('RichText')
  }
}

class TaroSwiperElement extends TaroElement<SwiperProps>{
  constructor() {
    super('Swiper')
  }
}

class TaroSwiperItemElement extends TaroElement<SwiperItemProps>{
  constructor() {
    super('SwiperItem')
  }
}

class TaroTextAreaElement extends TaroElement<TextareaProps>{
  constructor() {
    super('TextArea')
  }
}

export {
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
  TaroViewElement, 
}
