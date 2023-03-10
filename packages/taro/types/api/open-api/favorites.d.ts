/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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

  namespace checkIsAddedToMyMiniProgram {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /**是否被添加至 「我的小程序」 */
      added: boolean
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
    /** 预约视频号直播
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
    /**
     * 检查小程序是否被添加至 「我的小程序」
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/my-miniprogram/wx.checkIsAddedToMyMiniProgram.html
     */
    checkIsAddedToMyMiniProgram(option?: checkIsAddedToMyMiniProgram.Option):Promise<checkIsAddedToMyMiniProgram.SuccessCallbackResult>
  }
}
