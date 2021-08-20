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
  /** 监听内存不足告警事件。
   *
   * 当 iOS/Android 向小程序进程发出内存警告时，触发该事件。触发该事件不意味小程序被杀，大部分情况下仅仅是告警，开发者可在收到通知后回收一些不必要资源避免进一步加剧内存紧张。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.onMemoryWarning(function () {
   *   console.log('onMemoryWarningReceive')
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/performance/wx.onMemoryWarning.html
   */
  function onMemoryWarning(
    /** 内存不足告警事件的回调函数 */
    callback: onMemoryWarning.Callback,
  ): void

  namespace onMemoryWarning {
    /** 内存不足告警事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 内存告警等级，只有 Android 才有，对应系统宏定义 */
      level: keyof level
    }
    
    interface level {
      /** TRIM_MEMORY_RUNNING_MODERATE */
      5
      /** TRIM_MEMORY_RUNNING_LOW */
      10
      /** TRIM_MEMORY_RUNNING_CRITICAL */
      15
    }
  }
}
