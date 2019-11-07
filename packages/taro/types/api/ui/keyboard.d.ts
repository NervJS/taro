declare namespace Taro {
  /**
   * 收起键盘。
   * @example
```tsx
Taro.hideKeyboard()
```
   * @see https://developers.weixin.qq.com/minigame/dev/api/ui/keyboard/wx.hideKeyboard.html
   */
  function hideKeyboard(): void

  namespace getSelectedTextRange {
    type Promised = {
      /** 
       * 输入框光标结束位置
       */
      end: number
      /** 
       * 输入框光标起始位置
       */
      start: number
      /**
       * 错误信息
       */
      errMsg: string
    }

    type Param = {
      /** 
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: CompleteCallback
      /** 
       * 接口调用失败的回调函数
       */
      fail?: FailCallback
      /** 
       * 接口调用成功的回调函数
       */
      success?: SuccessCallback
    }

    type GeneralCallbackResult = {
      /**
       * 错误信息
       */
      errMsg: string
    }

    type CompleteCallback = (res: GeneralCallbackResult) => void
    type FailCallback = (res: GeneralCallbackResult) => void
    type SuccessCallback = (res: Promised) => void
  }
  /**
   * 在 `input`、`textarea` 等 `focus` 之后，获取输入框的光标位置。
   * 
   * **注意：** 只有在 `focus `的时候调用此接口才有效。
   * 
   * @param option 接口调用的参数
   * @example
```js
wx.getSelectedTextRange({
  complete: res => {
    console.log('getSelectedTextRange res', res.start, res.end)
  }
})
```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/keyboard/wx.getSelectedTextRange.html
   */
  function getSelectedTextRange(option?: getSelectedTextRange.Param): Promise<getSelectedTextRange.Promised>

  // TODO: wx.onKeyboardHeightChange
}
