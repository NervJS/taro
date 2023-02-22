/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
      return handle.success({})
    } catch (error) {
      return handle.fail({
        errMsg: error.message || error
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
    return handle.success()
  }
}
