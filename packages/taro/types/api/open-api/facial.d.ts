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
    interface CallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: number
    }
  }

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
    interface CallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: number
      /** 认证结果 */
      verifyResult: string
    }
  }

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
    interface CallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: number
      /** 认证结果 */
      verifyResult: string
    }
  }

  interface TaroStatic {
    /** 检查是否支持面部识别
     * @deprecated
     * @supported weapp
     */
    checkIsSupportFacialRecognition(
      option?: checkIsSupportFacialRecognition.Option
    ): Promise<checkIsSupportFacialRecognition.CallbackResult>

    /** 开始人脸识别认证
     * @deprecated
     * @supported weapp
     */
    startFacialRecognitionVerify(
      option?: startFacialRecognitionVerify.Option
    ): Promise<startFacialRecognitionVerify.CallbackResult>

    /** 开始人脸识别认证并上传认证视频
     * @deprecated
     * @supported weapp
     */
    startFacialRecognitionVerifyAndUploadVideo(
      option?: startFacialRecognitionVerifyAndUploadVideo.Option
    ): Promise<startFacialRecognitionVerifyAndUploadVideo.CallbackResult>
  }
}
