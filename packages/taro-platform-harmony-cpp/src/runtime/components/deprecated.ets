import { BUTTON_THEME_COLOR } from './utils/constant/style'

import type { TaroAny, TaroButtonElement, TaroElement, TaroObject } from '../runtime'

export function getButtonColor (node: TaroButtonElement, color: ResourceColor) {
  const _attrs: TaroAny = node._attrs
  const isDisabled: boolean = _attrs.disabled || false
  const isPlain: boolean = _attrs.plain || false
  const type: string = _attrs.type || 'default'

  if (isDisabled && isPlain) {
    return Color.Black
  }

  if (isPlain) {
    return BUTTON_THEME_COLOR.get(type).plainText
  }

  return color
}

export function getImageMode (mode: string): ImageFit {
  switch (mode) {
    case 'aspectFit': return ImageFit.Contain
    case 'aspectFill': return ImageFit.Cover
    case 'scaleToFill': return ImageFit.Fill
    case 'widthFix': return ImageFit.Auto
    case 'heightFix': return ImageFit.Auto
    default: return ImageFit.Contain
  }
}

@ComponentV2
export struct TaroDeprecated {
  @Builder customBuilder() {}
  @BuilderParam createChildItem?: (node: TaroElement, callback?: (node: TaroElement) => void) => void = this.customBuilder
  @BuilderParam createLazyChildren?: (node: TaroElement, layer?: number) => void = this.customBuilder

  @Param node: TaroObject = {}

  build() {
  }
}
