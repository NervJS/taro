declare namespace Taro {
  namespace uploadFile {
    type Promised = {
      /**
       * 开发者服务器返回的数据
       */
      data: string
      /**
       * 开发者服务器返回的 HTTP 状态码
       */
      statusCode: number
    }
    /**
     * 上传进度
     */
    type UploadTaskProgress = {
      progress: number
      totalBytesSent: number
      totalBytesExpectedToSend: number
    }
    /**
     * 上传进度回调
     */
    type UploadTaskProgressCallback = (res: UploadTaskProgress) => any
    /**
     * 上传任务
     */
    type UploadTask = Promise<uploadFile.Promised> & {
      /**
       * 上传进度回调
       */
      progress: (callback: UploadTaskProgressCallback) => void
      /**
       * 终止上传任务
       */
      abort: () => void
    }
    type Param = {
      /**
       * 开发者服务器 url
       */
      url: string
      /**
       * 要上传文件资源的路径
       */
      filePath: string
      /**
       * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
       */
      name: string
      /**
       * HTTP 请求 Header, header 中不能设置 Referer
       */
      header?: any
      /**
       * HTTP 请求中其他额外的 form data
       */
      formData?: any
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 `content-type` 为 `multipart/form-data` 。
   * **使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)**。
   *
   * 如页面通过 [Taro.chooseImage](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html)
   * 等接口获取到一个本地资源的临时文件路径后，可通过此接口将本地资源上传到指定服务器。
   *
   * **返回值：**
   *
   * @since 1.4.0
   *
   * 返回一个 `uploadTask` 对象，通过 `uploadTask`，可监听上传进度变化事件，以及取消上传任务。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseImage({
     success: function(res) {
       var tempFilePaths = res.tempFilePaths
       Taro.uploadFile({
         url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
         filePath: tempFilePaths[0],
         name: 'file',
         formData:{
           'user': 'test'
         },
         success: function(res){
           var data = res.data
           //do something
         }
       })
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   const uploadTask = Taro.uploadFile({
       url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
       filePath: tempFilePaths[0],
       name: 'file',
       formData:{
           'user': 'test'
       },
       success: function(res){
           var data = res.data
           //do something
       }
   })
         uploadTask.progress((res) => {
       console.log('上传进度', res.progress)
       console.log('已经上传的数据长度', res.totalBytesSent)
       console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
   })
         uploadTask.abort() // 取消上传任务
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
   */
  function uploadFile(OBJECT: uploadFile.Param): uploadFile.UploadTask
}
