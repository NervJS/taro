declare namespace Taro {
  namespace uploadFile {
    interface Option {
      /** 开发者服务器地址 */
      url: string
      /** 要上传文件资源的路径 */
      filePath: string
      /** 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 */
      name: string
      /** HTTP 请求 Header，Header 中不能设置 Referer */
      header?: General.IAnyObject
      /** HTTP 请求中其他额外的 form data */
      formData?: General.IAnyObject
      /** 超时时间，单位为毫秒 */
      timeout?: number
      /** 上传的文件名
       * @supported h5
       */
      fileName?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 开发者服务器返回的数据 */
      data: string
      /** 开发者服务器返回的 HTTP 状态码 */
      statusCode: number
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace UploadTask {
    /** HTTP Response Header 事件的回调函数 */
    type OffHeadersReceivedCallback = (
      res: General.CallbackResult,
    ) => void
    /** 上传进度变化事件的回调函数 */
    type OffProgressUpdateCallback = (
      res: General.CallbackResult,
    ) => void
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
      header: General.IAnyObject
    }
    interface OnProgressUpdateCallbackResult {
      /** 上传进度百分比 */
      progress: number
      /** 预期需要上传的数据总长度，单位 Bytes */
      totalBytesExpectedToSend: number
      /** 已经上传的数据长度，单位 Bytes */
      totalBytesSent: number
    }
  }

  /** 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 `content-type` 为 `multipart/form-data`。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。
   * @supported weapp, swan, alipay, h5
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
   *   url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
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
  function uploadFile(option: uploadFile.Option): Promise<uploadFile.SuccessCallbackResult & UploadTask> & UploadTask

  /** 一个可以监听上传进度变化事件，以及取消上传任务的对象
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.html
   */
  interface UploadTask {
    /** 中断上传任务
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.abort.html
     */
    abort(): void
    /** 取消监听 HTTP Response Header 事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.offHeadersReceived.html
     */
    offHeadersReceived(
      /** HTTP Response Header 事件的回调函数 */
      callback: UploadTask.OffHeadersReceivedCallback,
    ): void
    /** 取消监听上传进度变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.offProgressUpdate.html
     */
    offProgressUpdate(
      /** 上传进度变化事件的回调函数 */
      callback: UploadTask.OffProgressUpdateCallback,
    ): void
    /** 监听 HTTP Response Header 事件。会比请求完成事件更早
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.onHeadersReceived.html
     */
    onHeadersReceived(
      /** HTTP Response Header 事件的回调函数 */
      callback: UploadTask.OnHeadersReceivedCallback,
    ): void
    headersReceived(
      /** HTTP Response Header 事件的回调函数 */
      callback: UploadTask.OnHeadersReceivedCallback,
    ): void
    /** 监听上传进度变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.onProgressUpdate.html
     */
    onProgressUpdate(
      /** 上传进度变化事件的回调函数 */
      callback: UploadTask.OnProgressUpdateCallback,
    ): void
    progress(
      /** 上传进度变化事件的回调函数 */
      callback: UploadTask.OnProgressUpdateCallback,
    ): void
  }
}
