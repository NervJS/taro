import Taro from '../../index'

declare module '../../index' {
  namespace showToast {
    interface Option {
      /** 提示的内容 */
      title: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 提示的延迟时间 */
      duration?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 图标
       *
       * 可选值：
       * - 'success': 显示成功图标，此时 title 文本最多显示 7 个汉字长度;
       * - 'error': 显示失败图标，此时 title 文本最多显示 7 个汉字长度;
       * - 'loading': 显示加载图标，此时 title 文本最多显示 7 个汉字长度;
       * - 'none': 不显示图标，此时 title 文本最多可显示两行 */
      icon?: 'success' | 'error' | 'loading' | 'none'
      /** 自定义图标的本地路径，image 的优先级高于 icon */
      image?: string
      /** 是否显示透明蒙层，防止触摸穿透 */
      mask?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace showModal {
    interface Option {
      /** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
      cancelColor?: string
      /** 取消按钮的文字，最多 4 个字符 */
      cancelText?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
      confirmColor?: string
      /** 确认按钮的文字，最多 4 个字符 */
      confirmText?: string
      /** 提示的内容 */
      content?: string
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 是否显示取消按钮 */
      showCancel?: boolean
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 提示的标题 */
      title?: string
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭） */
      cancel: boolean
      /** 为 true 时，表示用户点击了确定按钮 */
      confirm: boolean
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace showLoading {
    interface Option {
      /** 提示的内容 */
      title: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 是否显示透明蒙层，防止触摸穿透 */
      mask?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace showActionSheet {
    interface Option {
      /** 警示文案 */
      alertText?: string
      /** 按钮的文字数组，数组长度最大为 6 */
      itemList: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 按钮的文字颜色 */
      itemColor?: string
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 用户点击的按钮序号，从上到下的顺序，从0开始 */
      tapIndex: number
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace hideToast {
    interface Option {
      /** 目前 toast 和 loading 相关接口可以相互混用，此参数可用于取消混用特性
       * @default false
       */
      noConflict?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace hideLoading {
    interface Option {
      /** 目前 toast 和 loading 相关接口可以相互混用，此参数可用于取消混用特性
       * @default false
       */
      noConflict?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace enableAlertBeforeUnload {
    interface Option {
      /** 询问对话框内容 */
      message: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace disableAlertBeforeUnload {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 显示消息提示框
     *
     * **注意**
     * - Taro.showLoading 和 Taro.showToast 同时只能显示一个
     * - Taro.showToast 应与 Taro.hideToast 配对使用
     * @supported weapp, h5, rn, tt, harmony_hybrid
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
    showToast(option?: showToast.Option): Promise<TaroGeneral.CallbackResult>

    /** 显示模态对话框
     * **注意**
     * - Android 6.7.2 以下版本，点击取消或蒙层时，回调 fail, errMsg 为 "fail cancel"；
     * - Android 6.7.2 及以上版本 和 iOS 点击蒙层不会关闭模态弹窗，所以尽量避免使用「取消」分支中实现业务逻辑
     * @supported weapp, swan, h5, rn, tt, harmony_hybrid
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
    showModal(option?: showModal.Option): Promise<showModal.SuccessCallbackResult>

    /** 显示 loading 提示框。需主动调用 Taro.hideLoading 才能关闭提示框
     *
     * **注意**
     * - Taro.showLoading 和 Taro.showToast 同时只能显示一个
     * - Taro.showLoading 应与 Taro.hideLoading 配对使用
     * @supported weapp, h5, rn, tt, harmony_hybrid
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
    showLoading(option?: showLoading.Option): Promise<TaroGeneral.CallbackResult>

    /** 显示操作菜单
     *
     * **注意**
     * - Android 6.7.2 以下版本，点击取消或蒙层时，回调 fail, errMsg 为 "fail cancel"；
     * - Android 6.7.2 及以上版本 和 iOS 点击蒙层不会关闭模态弹窗，所以尽量避免使用「取消」分支中实现业务逻辑
     * @supported weapp, h5, rn, tt, harmony_hybrid
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
    showActionSheet(option: showActionSheet.Option): Promise<showActionSheet.SuccessCallbackResult>

    /** 隐藏消息提示框
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideToast.html
     */
    hideToast(option?: hideToast.Option): void

    /** 隐藏 loading 提示框
     * @supported weapp, h5, rn, tt, harmony_hybrid
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
    hideLoading(option?: hideLoading.Option): void  /** 隐藏 loading 提示框

    /** 开启小程序页面返回询问对话框
     * @supported weapp
     * @example
     * ```tsx
     * Taro.enableAlertBeforeUnload({
     *   success: function () {
     *     console.log('success')
     *   },
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.enableAlertBeforeUnload.html
     */
    enableAlertBeforeUnload(option: enableAlertBeforeUnload.Option): void

    /** 关闭小程序页面返回询问对话框
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.disableAlertBeforeUnload.html
     */
    disableAlertBeforeUnload(option?: disableAlertBeforeUnload.Option): void
  }
}
