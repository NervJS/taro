import Taro from '../../index'

declare module '../../index' {
  namespace uploadFile {
    interface Option {
      /** 开发者服务器地址 */
      url: string
      /** 要上传文件资源的路径 */
      filePath: string
      /** 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 */
      name: string
      /** HTTP 请求 Header，Header 中不能设置 Referer */
      header?: TaroGeneral.IAnyObject
      /** HTTP 请求中其他额外的 form data */
      formData?: TaroGeneral.IAnyObject
      /** 超时时间，单位为毫秒 */
      timeout?: number
      /** 上传的文件名
       * @supported h5
       */
      fileName?: string
      /** 是否应使用传出凭据 (cookie) 发送此请求
       * @default true
       * @supported h5
       */
      withCredentials?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 开发者服务器返回的数据 */
      data: string
      /** 开发者服务器返回的 HTTP 状态码 */
      statusCode: number
      /** 调用结果 */
      errMsg: string
      /**
       * 开发者服务器返回的 HTTP Response Header
       * @supported weapp
       * @weapp 非官方文档标注属性
       */
      header?: TaroGeneral.IAnyObject
      /**
       * cookies
       * @supported weapp
       * @weapp 非官方文档标注属性
       */
      cookies?: string[]
    }
  }

  namespace UploadTask {
    /** HTTP Response Header 事件的回调函数 */
    type OnHeadersReceivedCallback = (
      result: OnHeadersReceivedCallbackResult,
    ) => void
    /** 上传进度变化事件的回调函数 */
    type OnProgressUpdateCallback = (
      result: OnProgressUpdateCallbackResult,
    ) => void
    interface OnHeadersReceivedCallbackResult {
      /** 开发者服务器返回的 HTTP Response Header */
      header: TaroGeneral.IAnyObject
    }
    interface OnProgressUpdateCallbackResult {
      /** 上传进度百分比 */
      progress: number
      /** 预期需要上传的数据总长度，单位 Bytes */
      totalBytesExpectedToSend: number
      /** 已经上传的数据长度，单位 Bytes */
      totalBytesSent: number
    }

    type UploadTaskPromise = Promise<uploadFile.SuccessCallbackResult> & UploadTask & {
      headersReceive: UploadTask['onHeadersReceived']
      progress: UploadTask['onProgressUpdate']
    }
  }

  /** 一个可以监听上传进度变化事件，以及取消上传任务的对象
   * @supported weapp, swan, alipay, h5, rn, tt, harmony_hybrid
   * @example
   * ```tsx
   * const uploadTask = Taro.uploadFile({
   *   url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
   *   filePath: tempFilePaths[0],
   *   name: 'file',
   *   formData:{
   *     'user': 'test'
   *   },
   *   success (res){
   *     const data = res.data
   *     //do something
   *   }
   * })
   *
   * uploadTask.onProgressUpdate((res) => {
   *   console.log('上传进度', res.progress)
   *   console.log('已经上传的数据长度', res.totalBytesSent)
   *   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
   * })
   *
   * uploadTask.abort() // 取消上传任务
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.html
   */
  interface UploadTask {
    /** 中断上传任务
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.abort.html
     */
    abort(): void
    /** 监听上传进度变化事件
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.onProgressUpdate.html
     */
    onProgressUpdate(
      /** 上传进度变化事件的回调函数 */
      callback: UploadTask.OnProgressUpdateCallback,
    ): void
    /** 取消监听上传进度变化事件
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.offProgressUpdate.html
     */
    offProgressUpdate(
      /** 上传进度变化事件的回调函数 */
      callback: UploadTask.OnProgressUpdateCallback,
    ): void
    /** 监听 HTTP Response Header 事件。会比请求完成事件更早
     * @supported weapp, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.onHeadersReceived.html
     */
    onHeadersReceived(
      /** HTTP Response Header 事件的回调函数 */
      callback: UploadTask.OnHeadersReceivedCallback,
    ): void
    /** 取消监听 HTTP Response Header 事件
     * @supported weapp, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.offHeadersReceived.html
     */
    offHeadersReceived(
      /** HTTP Response Header 事件的回调函数 */
      callback: UploadTask.OnHeadersReceivedCallback,
    ): void
  }

  interface TaroStatic {
    /** 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 `content-type` 为 `multipart/form-data`。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。
     * @supported weapp, swan, alipay, h5, rn, tt, harmony_hybrid, harmony
     * @example
     * ```tsx
     * Taro.chooseImage({
     *   success (res) {
     *     const tempFilePaths = res.tempFilePaths
     *     Taro.uploadFile({
     *       url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
     *       filePath: tempFilePaths[0],
     *       name: 'file',
     *       formData: {
     *         'user': 'test'
     *       },
     *       success (res){
     *         const data = res.data
     *         //do something
     *       }
     *     })
     *   }
     * })
     * ```
     * @example
     * ```tsx
     * const uploadTask = Taro.uploadFile({
     *   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
     *   filePath: tempFilePaths[0],
     *   name: 'file',
     *   formData:{
     *     'user': 'test'
     *   },
     *   success: function (res){
     *     var data = res.data
     *     //do something
     *   }
     * })
     * uploadTask.progress((res) => {
     *   console.log('上传进度', res.progress)
     *   console.log('已经上传的数据长度', res.totalBytesSent)
     *   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
     * })
     * uploadTask.abort() // 取消上传任务
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
     */
    uploadFile(option: uploadFile.Option): UploadTask.UploadTaskPromise
  }
}
