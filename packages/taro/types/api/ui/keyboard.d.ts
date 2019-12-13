declare namespace Taro {
  namespace hideKeyboard {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 在input、textarea等focus拉起键盘之后，手动调用此接口收起键盘
   * @supported weapp
   * @example
   * ```tsx
   * Taro.hideKeyboard({
   *   complete: res => {
   *     console.log('hideKeyboard res', res)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/minigame/dev/api/ui/keyboard/wx.hideKeyboard.html
   */
  function hideKeyboard(option?: hideKeyboard.Option): void

  namespace getSelectedTextRange {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 输入框光标结束位置 */
      end: number
      /** 输入框光标起始位置 */
      start: number
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 在input、textarea等focus之后，获取输入框的光标位置。注意：只有在focus的时候调用此接口才有效。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getSelectedTextRange({
   *   complete: res => {
   *     console.log('getSelectedTextRange res', res.start, res.end)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/keyboard/wx.getSelectedTextRange.html
   */
  function getSelectedTextRange(option?: getSelectedTextRange.Option): Promise<getSelectedTextRange.SuccessCallbackResult>

  namespace onKeyboardHeightChange {
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** 键盘高度 */
      height: number
    }
  }

  /** 监听键盘高度变化
   * @supported weapp
   * @example
   * ```tsx
   * Taro.onKeyboardHeightChange(res => {
   *   console.log(res.height)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/keyboard/wx.onKeyboardHeightChange.html
   */
  function onKeyboardHeightChange(callback: onKeyboardHeightChange.Callback): void
}
