declare namespace Taro {
  namespace request {
    type Promised < T extends any | string | ArrayBuffer = any > = {
      /**
       * 开发者服务器返回的数据
       *
       * **data 数据说明：**
       *
       * 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
       *
       * *   对于 `GET` 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
       * *   对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会对数据进行 JSON 序列化
       * *   对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
       */
      data: T
      /**
       * 开发者服务器返回的 HTTP 状态码
       */
      statusCode: number
      /**
       * 开发者服务器返回的 HTTP Response Header
       *
       * @since 1.2.0
       */
      header: any
    }
    /**
     * 网络请求任务对象
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.html
     */
    interface requestTask<T> extends Promise<request.Promised<T>> {
      /**
       * 中断请求任务
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.abort.html
       */
      abort(): void
    }
    type Param < P extends any | string | ArrayBuffer = any > = {
      /**
       * 开发者服务器接口地址
       */
      url: string
      /**
       * 请求的参数
       */
      data?: P
      /**
       * 设置请求的 header，header 中不能设置 Referer。
       */
      header?: any
      /**
       * （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       *
       * @default GET
       */
      method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
      /**
       * 如果设为 json，会尝试对返回的数据做一次 JSON.parse
       *
       * @default json
       */
      dataType?: string
      /**
       * 设置响应的数据类型。合法值：text、arraybuffer
       *
       * @default text
       * @since 1.7.0
       */
      responseType?: string
      /**
       * 设置 H5 端是否使用jsonp方式获取数据
       *
       * @default false
       */
      jsonp?: boolean
      /**
       * 设置 H5 端 jsonp 请求 url 是否需要被缓存
       *
       * @default false
       */
      jsonpCache?: boolean
      /**
       * 设置 H5 端是否允许跨域请求。有效值：no-cors, cors, same-origin
       *
       * @default same-origin
       */
      mode?: 'no-cors' | 'cors' | 'same-origin'
      /**
       * 设置 H5 端是否携带 Cookie。有效值：include, same-origin, omit
       *
       * @default omit
       */
      credentials?: 'include' | 'same-origin' | 'omit'
      /**
       * 设置 H5 端缓存模式。有效值：default, no-cache, reload, force-cache, only-if-cached
       *
       * @default default
       */
      cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached'
      /**
       * 设置 H5 端请求响应超时时间
       *
       * @default 2000
       */
      timeout?: number
      /**
       * 设置 H5 端请求重试次数
       *
       * @default 2
       */
      retryTimes?: number
      /**
       * 设置 H5 端请求的兜底接口
       */
      backup?: string | string[]
      /**
       * 设置 H5 端请求响应的数据校验函数，若返回 false，则请求兜底接口，若无兜底接口，则报请求失败
       */
      dataCheck?(): boolean
      /**
       * 设置 H5 端请求是否使用缓存
       *
       * @default false
       */
      useStore?: boolean
      /**
       * 设置 H5 端请求缓存校验的 key
       */
      storeCheckKey?: string
      /**
       * 设置 H5 端请求缓存签名
       */
      storeSign?: string
      /**
       * 设置 H5 端请求校验函数，一般不需要设置
       */
      storeCheck?(): boolean
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
   * 发起网络请求。**使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)**。
   *
   * **返回值：**
   *
   * @returns {request.requestTask} 返回一个 `requestTask` 对象，通过 `requestTask`，可中断请求任务。
   *
   * @since 1.4.0
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: content-type 默认为 'application/json';
   * 2.  `tip`: url 中不能有端口；
   * 3.  `bug`: 开发者工具 `0.10.102800` 版本，`header` 的 `content-type` 设置异常；
   *
   * **示例代码：**
   *
   * @example
   * // 回调函数(Callback)用法：
   * const requestTask = Taro.request({
   *   url: 'test.php', //仅为示例，并非真实的接口地址
   *   data: {
   *     x: '' ,
   *     y: ''
   *   },
   *   header: {
   *     'content-type': 'application/json' // 默认值
   *   },
   *   success: function(res) {
   *     console.log(res.data)
   *   }
   * })
   * requestTask.abort()
   *
   * // Promise 用法：
   * const requestTask = Taro.request({
   *   url: 'test.php', //仅为示例，并非真实的接口地址
   *   data: {
   *     x: '' ,
   *     y: ''
   *   },
   *   header: {
   *     'content-type': 'application/json' // 默认值
   *   },
   *   success: function(res) {
   *     console.log(res.data)
   *   }
   * })
   * requestTask.then(res => {
   *   console.log(res.data)
   * })
   * requestTask.abort()
   *
   * // async/await 用法：
   * const requestTask = Taro.request(params)
   * const res = await requestTask
   * requestTask.abort()
   *
   * // 不需要 abort 的 async/await 用法：
   * const res = await Taro.request(params)
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
   */
  function request<T = any, U = any>(OBJECT: request.Param<U>): request.requestTask<T>
}
