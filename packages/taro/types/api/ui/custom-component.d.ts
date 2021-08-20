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
  /** 延迟一部分操作到下一个时间片再执行。（类似于 setTimeout）
   *
   * **说明**
   * 因为自定义组件中的 setData 和 triggerEvent 等接口本身是同步的操作，当这几个接口被连续调用时，都是在一个同步流程中执行完的，因此若逻辑不当可能会导致出错。
   * 一个极端的案例：当父组件的 setData 引发了子组件的 triggerEvent，进而使得父组件又进行了一次 setData，期间有通过 wx:if 语句对子组件进行卸载，就有可能引发奇怪的错误，所以对于不需要在一个同步流程内完成的逻辑，可以使用此接口延迟到下一个时间片再执行。
   * @supported weapp
   * @example
   * ```tsx
   * this.setData({ number: 1 }) // 直接在当前同步流程中执行
   * Taro.nextTick(() => {
   *   this.setData({ number: 3 }) // 在当前同步流程结束后，下一个时间片执行
   * })
   * this.setData({ number: 2 }) // 直接在当前同步流程中执行
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/custom-component/wx.nextTick.html
   */
  function nextTick(callback: (...args: any[]) => any): void
}
