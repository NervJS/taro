import Taro from '../../index'

declare module '../../index' {
  namespace hideKeyboard {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getSelectedTextRange {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 输入框光标结束位置 */
      end: number
      /** 输入框光标起始位置 */
      start: number
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace onKeyboardHeightChange {
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** 键盘高度 */
      height: number
    }
  }

  interface TaroStatic {
    /** 在input、textarea等focus拉起键盘之后，手动调用此接口收起键盘
     * @supported weapp, alipay, swan, jd, tt, rn, harmony_hybrid
     * @example
     * ```tsx
     * Taro.hideKeyboard({
     *   complete: res => {
     *     console.log('hideKeyboard res', res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.hideKeyboard.html
     */
    hideKeyboard(option?: hideKeyboard.Option): Promise<TaroGeneral.CallbackResult>

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
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.getSelectedTextRange.html
     */
    getSelectedTextRange(option?: getSelectedTextRange.Option): Promise<getSelectedTextRange.SuccessCallbackResult>

    /** 监听键盘高度变化
     * @supported weapp, swan, jd, qq, rn
     * @example
     * ```tsx
     * Taro.onKeyboardHeightChange(res => {
     *   console.log(res.height)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.onKeyboardHeightChange.html
     */
    onKeyboardHeightChange(
      callback: onKeyboardHeightChange.Callback
    ): void

    /**
     * 取消监听键盘高度变化事件。
     * @supported weapp, swan, jd, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.offKeyboardHeightChange.html
     */
    offKeyboardHeightChange(
      /** 键盘高度变化事件的回调函数 */
      callback?: onKeyboardHeightChange.Callback
    ): void
  }
}
