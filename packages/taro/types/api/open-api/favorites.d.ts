import Taro from '../../index'

declare module '../../index' {
  namespace addVideoToFavorites {
    interface Option {
      /** 要收藏的视频地址，必须为本地路径或临时路径 */
      videoPath: string
      /** 缩略图路径，若留空则使用视频首帧 */
      thumbPath?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace addFileToFavorites {
    interface Option {
      /** 要收藏的文件地址，必须为本地路径或临时路径 */
      filePath: string
      /** 自定义文件名，若留空则使用filePath中的文件名 */
      fileName?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 收藏视频
     * @supported weapp
     * @example
     * ```tsx
     * // callback 写法
     * Taro.downloadFile({
     *   url: URL, // 下载url
     *   success (res) {
     *     // 下载完成后收藏
     *     Taro.addVideoToFavorites({
     *       videoPath: res.tempFilePath,
     *       success() {},
     *       fail: console.error,
     *     })
     *   },
     *   fail: console.error,
     * })
     * ```
     * @example
     * ```tsx
     * // async await 写法
     * const { tempFilePath } = await Taro.downloadFile({
     *   url: URL, // 下载url
     * })
     * // 下载完成后收藏
     * await Taro.addVideoToFavorites({
     *   videoPath: res.tempFilePath,
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/favorites/wx.addVideoToFavorites.html
     */
    addVideoToFavorites(option?: addVideoToFavorites.Option): Promise<TaroGeneral.CallbackResult>

    /** 收藏文件
     * @supported weapp
     * @example
     * ```tsx
     * // callback 写法
     * Taro.downloadFile({
     *   url: URL, // 下载url
     *   success (res) {
     *     // 下载完成后收藏
     *     Taro.addFileToFavorites({
     *       filePath: res.tempFilePath,
     *       success() {},
     *       fail: console.error,
     *     })
     *   },
     *   fail: console.error,
     * })
     * ```
     * @example
     * ```tsx
     * // async await 写法
     * const { tempFilePath } = await Taro.downloadFile({
     *   url: URL, // 下载url
     * })
     * // 下载完成后收藏
     * await Taro.addFileToFavorites({
     *   filePath: res.tempFilePath,
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/favorites/wx.addFileToFavorites.html
     */
    addFileToFavorites(option?: addFileToFavorites.Option): Promise<TaroGeneral.CallbackResult>
  }
}
