import { temporarilyNotSupport } from '../../../utils'

/**
 * 在input、textarea等focus之后，获取输入框的光标位置
 * 
 * @canNotUse getSelectedTextRange
 */
export const getSelectedTextRange = /* @__PURE__ */ temporarilyNotSupport('getSelectedTextRange')

export * from './hideKeyboard'
export * from './offKeyboardHeightChange'
export * from './onKeyboardHeightChange'
