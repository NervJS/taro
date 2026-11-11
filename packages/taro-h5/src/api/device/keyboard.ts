import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

// 键盘
export const onKeyboardHeightChange = /* @__PURE__ */ temporarilyNotSupport('onKeyboardHeightChange')
export const offKeyboardHeightChange = /* @__PURE__ */ temporarilyNotSupport('offKeyboardHeightChange')
export const hideKeyboard = /* @__PURE__ */ temporarilyNotSupport('hideKeyboard')
export const getSelectedTextRange: typeof Taro.getSelectedTextRange = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getSelectedTextRange.SuccessCallbackResult>({ name: 'getSelectedTextRange', success, fail, complete })
  const input = typeof document === 'undefined' ? null : document.activeElement
  if (input && (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
    const { selectionStart: start, selectionEnd: end } = input
    if (start !== null && end !== null) return handle.success({ start, end })
  }
  return handle.fail({ errMsg: 'no focused input with a text selection' })
}
