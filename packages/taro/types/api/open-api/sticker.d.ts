import Taro from '../../index'

declare module '../../index' {
  namespace openStickerSetView {
    interface Option {
      /** 表情专辑链接，可前往[表情开放平台](https://sticker.weixin.qq.com/cgi-bin/mmemoticonwebnode-bin/pages/home)，在详情页中的「小程序跳转链接」入口复制 */
      url: Object
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openStickerIPView {
    interface Option {
      /** 表情IP合辑链接，可前往[表情开放平台](https://sticker.weixin.qq.com/cgi-bin/mmemoticonwebnode-bin/pages/home)，在详情页中的「小程序跳转链接」入口复制 */
      url: Object
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openSingleStickerView {
    interface Option {
      /** 表情链接，可前往(表情开放平台)[https://sticker.weixin.qq.com/cgi-bin/mmemoticonwebnode-bin/pages/home]，在详情页中的「小程序跳转链接」入口复制 */
      url: Object
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 打开表情专辑
     * @supported weapp
     * @example
     * ```tsx
     * Taro.openStickerSetView({
     *   url: '',
     *   success(res) {}
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/sticker/wx.openStickerSetView.html
     */
    openStickerSetView(option: openStickerSetView.Option): void

    /** 打开表情IP合辑
     * @supported weapp
     * @example
     * ```tsx
     * Taro.openStickerIPView({
     *   url: '',
     *   success(res) {}
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/sticker/wx.openStickerIPView.html
     */
    openStickerIPView(option: openStickerIPView.Option): void
    
    /** 打开单个表情
     * @supported weapp
     * @example
     * ```tsx
     * Taro.openSingleStickerView({
     *   url: '',
     *   success(res) {}
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/sticker/wx.openSingleStickerView.html
     */
    openSingleStickerView(option: openSingleStickerView.Option): void
  }
}