/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
  namespace setBackgroundTextStyle {
    interface Option {
      /** 下拉背景字体、loading 图的样式。
       *
       * 可选值：
       * - 'dark': dark 样式;
       * - 'light': light 样式; */
      textStyle: 'dark' | 'light'
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setBackgroundColor {
    interface Option {
      /** 窗口的背景色，必须为十六进制颜色值 */
      backgroundColor?: string
      /** 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持 */
      backgroundColorBottom?: string
      /** 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持 */
      backgroundColorTop?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 动态设置下拉背景字体、loading 图的样式
     * @supported weapp, rn
     * @rn 仅 iOS
     * @example
     * ```tsx
     * Taro.setBackgroundTextStyle({
     *   textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundTextStyle.html
     */
    setBackgroundTextStyle(option: setBackgroundTextStyle.Option): Promise<TaroGeneral.CallbackResult>

    /** 动态设置窗口的背景色
     * @supported weapp, rn
     * @rn 仅 Android
     * @example
     * ```tsx
     * Taro.setBackgroundColor({
     *   backgroundColor: '#ffffff', // 窗口的背景色为白色
     * })
     * Taro.setBackgroundColor({
     *   backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
     *   backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundColor.html
     */
    setBackgroundColor(option: setBackgroundColor.Option): Promise<TaroGeneral.CallbackResult>
  }
}
