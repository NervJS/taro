declare namespace Taro {
  namespace downloadFile {
    type Promised = {
      /**
       * 临时文件路径，下载后的文件会存储到一个临时文件
       */
      tempFilePath: string
      /**
       * 开发者服务器返回的 HTTP 状态码
       */
      statusCode: number
    }
    type Param = {
      /**
       * 下载资源的 url
       */
      url: string
      /**
       * HTTP 请求 Header，header 中不能设置 Referer
       */
      header?: any
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
    /**
     * 下载进度
     */
    type DownloadTaskProgress = {
      progress: number
      totalBytesWritten: number
      totalBytesExpectedToWrite: number
    }
    /**
     * 下载进度回调
     */
    type DownloadTaskProgressCallback = (res: DownloadTaskProgress) => any
    /**
     * 下载任务
     */
    type DownloadTask = Promise<downloadFile.Promised> & {
      /**
       * 下载进度回调
       */
      progress: (params: DownloadTaskProgressCallback) => void
      /**
       * 终止下载任务
       */
      abort: () => void
    }
  }
  /**
   * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。
   * **使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)**。
   *
   * **返回值：**
   *
   * @since 1.4.0
   *
   * 返回一个 `downloadTask` 对象，通过 `downloadTask`，可监听下载进度变化事件，以及取消下载任务。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 6.5.3 以及之前版本的 iOS 微信客户端 `header` 设置无效
   *
   * **示例代码：**
   *
   ```javascript
   Taro.downloadFile({
     url: 'https://example.com/audio/123', //仅为示例，并非真实的资源
     success: function(res) {
       // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
       if (res.statusCode === 200) {
           Taro.playVoice({
             filePath: res.tempFilePath
           })
       }
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   const downloadTask = Taro.downloadFile({
       url: 'http://example.com/audio/123', //仅为示例，并非真实的资源
       success: function(res) {
           Taro.playVoice({
               filePath: res.tempFilePath
           })
       }
   })
         downloadTask.progress((res) => {
       console.log('下载进度', res.progress)
       console.log('已经下载的数据长度', res.totalBytesWritten)
       console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
   })
         downloadTask.abort() // 取消下载任务
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html
   */
  function downloadFile(OBJECT: downloadFile.Param): downloadFile.DownloadTask
}
