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
  namespace startAccelerometer {
    type Option = {
      /**
       * 监听加速度数据回调函数的执行频率
       * @default "normal"
       */
      interval?: keyof interval
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    type interval = {
      /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
      game: 'game',
      /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
      ui: 'ui',
      /** 普通的回调频率，在 200ms/次 左右 */
      normal: 'normal'
    }
  }
  /**
   * 开始监听加速度数据。
   * @example
   * ```tsx
   * Taro.startAccelerometer({ interval: 'game' })
   * ```
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.startAccelerometer.html
   */
  function startAccelerometer (res?: startAccelerometer.Option): Promise<General.CallbackResult>

  namespace stopAccelerometer {
    type Option = {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /**
   * 停止监听加速度数据。
   * @example
   * ```tsx
   * Taro.stopAccelerometer()
   * ```
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.stopAccelerometer.html
   */
  function stopAccelerometer (res?: stopAccelerometer.Option): Promise<General.CallbackResult>

  namespace onAccelerometerChange {
    type Callback = (res: Result) => void
    type Result = {
      /** X 轴 */
      x: number
      /** Y 轴 */
      y: number
      /** Z 轴 */
      z: number
    }
  }
  /**
   * 监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 `Taro.stopAccelerometer` 停止监听。
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.onAccelerometerChange(res => {
   *   console.log(res.x)
   *   console.log(res.y)
   *   console.log(res.z)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.onAccelerometerChange.html
   */
  function onAccelerometerChange (callback: onAccelerometerChange.Callback): void

  /**
   * 取消监听加速度数据事件，参数为空，则取消所有的事件监听。
   * @supported weapp, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.offAccelerometerChange.html 
   */
  function offAccelerometerChange(
    /** 加速度数据事件的回调函数 */
    callback?: (...args: any[]) => any,
  ): void
}
