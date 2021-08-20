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
  namespace checkIsSupportFacialRecognition {
    interface Option {
      /** 交互方式 */
      checkAliveType?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: CallbackResult) => void
    }
    interface CallbackResult extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: number
    }
  }

  /** 检查是否支持面部识别
   * @supported weapp
   */
  function checkIsSupportFacialRecognition(
    option?: checkIsSupportFacialRecognition.Option
  ): Promise<checkIsSupportFacialRecognition.CallbackResult>

  namespace startFacialRecognitionVerify {
    interface Option {
      /** 身份证名称 */
      name: string
      /** 身份证名称 */
      idCardNumber: string
      /** 交互方式 */
      checkAliveType?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: CallbackResult) => void
    }
    interface CallbackResult extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: number
      /** 认证结果 */
      verifyResult: string
    }
  }

  /** 开始人脸识别认证
   * @supported weapp
   */
  function startFacialRecognitionVerify(
    option?: startFacialRecognitionVerify.Option
  ): Promise<startFacialRecognitionVerify.CallbackResult>

  namespace startFacialRecognitionVerifyAndUploadVideo {
    interface Option {
      /** 身份证名称 */
      name: string
      /** 身份证名称 */
      idCardNumber: string
      /** 交互方式 */
      checkAliveType?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: CallbackResult) => void
    }
    interface CallbackResult extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: number
      /** 认证结果 */
      verifyResult: string
    }
  }

  /** 开始人脸识别认证并上传认证视频
   * @supported weapp
   */
  function startFacialRecognitionVerifyAndUploadVideo(
    option?: startFacialRecognitionVerifyAndUploadVideo.Option
  ): Promise<startFacialRecognitionVerifyAndUploadVideo.CallbackResult>
}
