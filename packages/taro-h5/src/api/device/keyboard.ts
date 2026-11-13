import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

// 键盘
export const onKeyboardHeightChange = /* @__PURE__ */ temporarilyNotSupport('onKeyboardHeightChange')
export const offKeyboardHeightChange = /* @__PURE__ */ temporarilyNotSupport('offKeyboardHeightChange')

function getFocusedElement () {
  if (typeof document === 'undefined') return null
  let el = document.activeElement
  // 焦点在 Shadow DOM 内部时，document.activeElement 只是宿主元素
  while (el?.shadowRoot?.activeElement) {
    el = el.shadowRoot.activeElement
  }
  return el
}

export const hideKeyboard: typeof Taro.hideKeyboard = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'hideKeyboard', success, fail, complete })
  const el = getFocusedElement()
  // 浏览器没有收起键盘的接口，让拉起键盘的可编辑元素失焦即可收起键盘
  if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el instanceof HTMLElement && el.isContentEditable))) {
    el.blur()
  }
  return handle.success()
}

export const getSelectedTextRange: typeof Taro.getSelectedTextRange = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getSelectedTextRange.SuccessCallbackResult>({ name: 'getSelectedTextRange', success, fail, complete })
  const input = typeof document === 'undefined' ? null : document.activeElement
  if (input && (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
    const { selectionStart: start, selectionEnd: end } = input
    if (start !== null && end !== null) return handle.success({ start, end })
  }
  return handle.fail({ errMsg: 'no focused input with a text selection' })
}
