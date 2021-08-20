/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/**
 *
 * Based on original code from: https://github.com/qiu8310/minapp/blob/master/packages/minapp-wx/typing/wx.d.ts
 * Lincenced under MIT license: https://github.com/qiu8310/minapp/issues/69
 *
 */
declare namespace Taro {
  namespace pageScrollTo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 滚动动画的时长，单位 ms */
      duration?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 滚动到页面的目标位置，单位 px */
      scrollTop?: number
      /** 选择器, css selector */
      selector?: string
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 将页面滚动到目标位置，支持选择器和滚动距离两种方式定位
   *
   * **selector 语法**
   * selector类似于 CSS 的选择器，但仅支持下列语法。
   *
   * + ID选择器：#the-id
   * + class选择器（可以连续指定多个）：.a-class.another-class
   * + 子元素选择器：.the-parent > .the-child
   * + 后代选择器：.the-ancestor .the-descendant
   * + 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
   * + 多选择器的并集：#a-node, .some-other-nodes
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.pageScrollTo({
   *   scrollTop: 0,
   *   duration: 300
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html
   */
  function pageScrollTo(option: pageScrollTo.Option): Promise<General.CallbackResult>
}
