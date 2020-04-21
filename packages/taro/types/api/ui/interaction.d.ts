declare namespace Taro {
  namespace showToast {
    interface Option {
      /** 提示的内容 */
      title: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 提示的延迟时间 */
      duration?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 图标
       *
       * 可选值：
       * - 'success': 显示成功图标，此时 title 文本最多显示 7 个汉字长度;
       * - 'loading': 显示加载图标，此时 title 文本最多显示 7 个汉字长度;
       * - 'none': 不显示图标，此时 title 文本最多可显示两行 */
      icon?: 'success' | 'loading' | 'none'
      /** 自定义图标的本地路径，image 的优先级高于 icon */
      image?: string
      /** 是否显示透明蒙层，防止触摸穿透 */
      mask?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 显示消息提示框
   * 
   * **注意**
   * - Taro.showLoading 和 Taro.showToast 同时只能显示一个
   * - Taro.showToast 应与 Taro.hideToast 配对使用
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.showToast({
   *   title: '成功',
   *   icon: 'success',
   *   duration: 2000
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html
   */
  function showToast(option: showToast.Option): Promise<General.CallbackResult>

  namespace showModal {
    interface Option {
      /** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
      cancelColor?: string
      /** 取消按钮的文字，最多 4 个字符 */
      cancelText?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
      confirmColor?: string
      /** 确认按钮的文字，最多 4 个字符 */
      confirmText?: string
      /** 提示的内容 */
      content?: string
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 是否显示取消按钮 */
      showCancel?: boolean
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 提示的标题 */
      title?: string
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭） */
      cancel: boolean
      /** 为 true 时，表示用户点击了确定按钮 */
      confirm: boolean
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 显示模态对话框
   * **注意**
   * - Android 6.7.2 以下版本，点击取消或蒙层时，回调 fail, errMsg 为 "fail cancel"；
   * - Android 6.7.2 及以上版本 和 iOS 点击蒙层不会关闭模态弹窗，所以尽量避免使用「取消」分支中实现业务逻辑
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.showModal({
   *   title: '提示',
   *   content: '这是一个模态弹窗',
   *   success: function (res) {
   *     if (res.confirm) {
   *       console.log('用户点击确定')
   *     } else if (res.cancel) {
   *       console.log('用户点击取消')
   *     }
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
   */
  function showModal(option: showModal.Option): Promise<showModal.SuccessCallbackResult>

  namespace showLoading {
    interface Option {
      /** 提示的内容 */
      title: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 是否显示透明蒙层，防止触摸穿透 */
      mask?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 显示 loading 提示框。需主动调用 Taro.hideLoading 才能关闭提示框
   *
   * **注意**
   * - Taro.showLoading 和 Taro.showToast 同时只能显示一个
   * - Taro.showLoading 应与 Taro.hideLoading 配对使用
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.showLoading({
   *   title: '加载中',
   * })
   * setTimeout(function () {
   *   Taro.hideLoading()
   * }, 2000)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html
   */
  function showLoading(option: showLoading.Option): Promise<General.CallbackResult>

  namespace showActionSheet {
    interface Option {
      /** 按钮的文字数组，数组长度最大为 6 */
      itemList: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 按钮的文字颜色 */
      itemColor?: string
      /** 接口调用成功的回调函数 */
      success?: (result: General.CallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 用户点击的按钮序号，从上到下的顺序，从0开始 */
      tapIndex: number
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 显示操作菜单
   * 
   * **注意**
   * - Android 6.7.2 以下版本，点击取消或蒙层时，回调 fail, errMsg 为 "fail cancel"；
   * - Android 6.7.2 及以上版本 和 iOS 点击蒙层不会关闭模态弹窗，所以尽量避免使用「取消」分支中实现业务逻辑
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.showActionSheet({
   *   itemList: ['A', 'B', 'C'],
   *   success: function (res) {
   *     console.log(res.tapIndex)
   *   },
   *   fail: function (res) {
   *     console.log(res.errMsg)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showActionSheet.html
   */
  function showActionSheet(option: showActionSheet.Option): Promise<showActionSheet.SuccessCallbackResult>

  namespace hideToast {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 隐藏消息提示框
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideToast.html
   */
  function hideToast(option?: hideToast.Option): void

  namespace hideLoading {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 隐藏 loading 提示框
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.showLoading({
   *   title: '加载中',
   * })
   * setTimeout(function (){
   *   Taro.hideLoading()
   * },2000)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideLoading.html
   */
  function hideLoading(option?: hideLoading.Option): void
}
