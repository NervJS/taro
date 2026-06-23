import Taro from '@tarojs/api'

import { MethodHandler } from '../../utils/handler'

// 字体
export const loadFontFace: typeof Taro.loadFontFace = async options => {
  options = Object.assign({ global: false }, options)
  const { success, fail, complete, family, source, desc = {} } = options
  const handle = new MethodHandler({ name: 'loadFontFace', success, fail, complete })
  // @ts-ignore
  const fonts = document.fonts
  if (fonts) {
    // @ts-ignore
    const fontFace = new FontFace(family, source, desc)
    try {
      await fontFace.load()
      fonts.add(fontFace)
      return handle.success({ status: 'loaded' })
    } catch (error) {
      return handle.fail({
        status: 'error',
        errMsg: error.message || error,
      })
    }
  } else {
    const style = document.createElement('style')
    let innerText = `font-family:"${
      family
    }";src:${
      source
    };font-style:${
      desc.style || 'normal'
    };font-weight:${
      desc.weight || 'normal'
    };font-variant:${
      desc.variant || 'normal'
    };`

    if (desc.ascentOverride) {
      innerText += `ascent-override:${desc.ascentOverride};`
    }
    if (desc.descentOverride) {
      innerText += `descent-override:${desc.descentOverride};`
    }
    if (desc.featureSettings) {
      innerText += `font-feature-settings:${desc.featureSettings};`
    }
    if (desc.lineGapOverride) {
      innerText += `line-gap-override:${desc.lineGapOverride};`
    }
    if (desc.stretch) {
      innerText += `font-stretch:${desc.stretch};`
    }
    if (desc.unicodeRange) {
      innerText += `unicode-range:${desc.unicodeRange};`
    }
    if (desc.variationSettings) {
      innerText += `font-variation-settings:${desc.variationSettings};`
    }

    style.innerText = `@font-face{${innerText}}`
    document.head.appendChild(style)
    return handle.success({ status: 'loaded' })
  }
}
