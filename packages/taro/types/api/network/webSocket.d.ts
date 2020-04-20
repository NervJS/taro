declare namespace Taro {
  namespace sendSocketMessage {
    type Param = {
      /**
       * 需要发送的内容
       */
      data: string | ArrayBuffer
    }
  }
  /**
   * 通过 WebSocket 连接发送数据，需要先 [Taro.connectSocket](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html) 回调之后才能发送。
   *
   * **示例代码：**
   *
   ```javascript
   var socketOpen = false
   var socketMsgQueue = []
   Taro.connectSocket({
     url: 'test.php'
   })
         Taro.onSocketOpen(function(res) {
     socketOpen = true
     for (var i = 0; i < socketMsgQueue.length; i++){
        sendSocketMessage(socketMsgQueue[i])
     }
     socketMsgQueue = []
   })
         function sendSocketMessage(msg) {
     if (socketOpen) {
       Taro.sendSocketMessage({
         data:msg
       })
     } else {
        socketMsgQueue.push(msg)
     }
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.sendSocketMessage.html
   */
  function sendSocketMessage(OBJECT: sendSocketMessage.Param): Promise<any>

  namespace onSocketOpen {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 连接成功的 HTTP 响应 Header
       *
       * @since 2.0.0
       */
      header?: any
    }
  }
  /**
   * 监听WebSocket连接打开事件。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
   Taro.onSocketOpen(function(res) {
     console.log('WebSocket连接已打开！')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketOpen.html
   */
  function onSocketOpen(callback?: onSocketOpen.Param): void

  namespace onSocketMessage {
    type Param < T = any > = (res: ParamParam<T>) => any
    type ParamParam < T extends any | string | ArrayBuffer = any > = {
      /**
       * 服务器返回的消息
       */
      data: T
    }
  }
  /**
   * 监听WebSocket接受到服务器的消息事件。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
         Taro.onSocketMessage(function(res) {
     console.log('收到服务器内容：' + res.data)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketMessage.html
   */
  function onSocketMessage<T = any>(CALLBACK?: onSocketMessage.Param<T>): void

  /**
   * 监听WebSocket错误。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
   Taro.onSocketOpen(function(res){
     console.log('WebSocket连接已打开！')
   })
   Taro.onSocketError(function(res){
     console.log('WebSocket连接打开失败，请检查！')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketError.html
   */
  function onSocketError(CALLBACK: any): void

  /**
   * 监听WebSocket关闭。
   *
   * **返回值：**
   *
   * @since 1.7.0
   *
   * 返回一个 [SocketTask](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html)。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 基础库 1.7.0 开始，支持同时存在 2 条 WebSocket 连接
   *
   * **示例：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
         //注意这里有时序问题，
   //如果 Taro.connectSocket 还没回调 Taro.onSocketOpen，而先调用 Taro.closeSocket，那么就做不到关闭 WebSocket 的目的。
   //必须在 WebSocket 打开期间调用 Taro.closeSocket 才能关闭。
   Taro.onSocketOpen(function() {
     Taro.closeSocket()
   })
         Taro.onSocketClose(function(res) {
     console.log('WebSocket 已关闭！')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketClose.html
   */
  function onSocketClose(CALLBACK?: (res: any) => any): void

  namespace connectSocket {
    type Promised = SocketTask

    type Param = {
      /**
       * 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
       */
      url: string
      /**
       * HTTP Header , header 中不能设置 Referer
       */
      header?: any
      /**
       * 默认是GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       */
      method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
      /**
       * 子协议数组
       *
       * @since 1.4.0
       */
      protocols?: string[]
    }
  }
  /**
   * 创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 连接。
   * **使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)**。
   *
   * **基础库 1.7.0 之前，一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。基础库版本 1.7.0 及以后，支持存在多个 WebSokcet 连接，每次成功调用 Taro.connectSocket 会返回一个新的 [SocketTask](https://developers.weixin.qq.com/minigame/dev/api/network/websocket/SocketTask.html)。**
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'wss://example.qq.com',
     data:{
       x: '',
       y: ''
     },
     header:{
       'content-type': 'application/json'
     },
     protocols: ['protocol1'],
     method:"GET"
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html
   */
  function connectSocket(OBJECT: connectSocket.Param): Promise<connectSocket.Promised>

  namespace closeSocket {
    type Param = {
      /**
       * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
       *
       * @since 1.4.0
       */
      code?: number
      /**
       * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
       *
       * @since 1.4.0
       */
      reason?: string
    }
  }
  /**
   * 关闭 WebSocket 连接。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.closeSocket.html
   */
  function closeSocket(OBJECT?: closeSocket.Param): Promise<any>

  namespace SocketTask {
    namespace send {
      type Param = {
        /**
         * 需要发送的内容
         */
        data: string | ArrayBuffer
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
    namespace close {
      type Param = {
        /**
         * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
         */
        code?: number
        /**
         * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
         */
        reason?: string
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
    namespace onError {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 错误信息
         */
        errMsg: string
      }
    }
    namespace onMessage {
      type Param < T = any > = (res: ParamParam<T>) => any
      type ParamParam < T extends any | string | ArrayBuffer = any > = {
        /**
         * 服务器返回的消息
         */
        data: T
      }
    }
  }
  /**
   * @since 1.7.0
   *
   * WebSocket 任务，可通过 [Taro.connectSocket()](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html) 接口创建返回。
   */
  class SocketTask {

    /**
     * websocket 当前的连接 ID。
     */
    readonly socketTaskId: number

    /**
     * websocket 当前的连接状态。
     */
    readonly readyState: number

    /**
     * websocket 接口调用结果。
     */
    readonly errMsg: string

    /**
     * websocket 状态值：连接中。
     */
    readonly CONNECTING: number

    /**
     * websocket 状态值：已连接。
     */
    readonly OPEN: number

    /**
     * websocket 状态值：关闭中。
     */
    readonly CLOSING: number

    /**
     * websocket 状态值：已关闭。
     */
    readonly CLOSED: number

    /**
     * 浏览器 websocket 实例。（h5 端独有）
     */
    readonly ws: WebSocket

    /**
     *
     * **SocketTask.send(OBJECT)：**
     *
     * 通过 WebSocket 连接发送数据。
     */
    send(OBJECT: SocketTask.send.Param): void
    /**
     *
     * **SocketTask.close(OBJECT)：**
     *
     * 关闭 WebSocket 连接。
     */
    close(OBJECT: SocketTask.close.Param): void
    /**
     *
     * **SocketTask.onOpen(CALLBACK)：**
     *
     * 监听 WebSocket 连接打开事件。
     */
    onOpen(CALLBACK?: any): void
    /**
     *
     * **SocketTask.onClose(CALLBACK)：**
     *
     * 监听 WebSocket 连接关闭事件。
     */
    onClose(CALLBACK?: any): void
    /**
     *
     * **SocketTask.onError(CALLBACK)：**
     *
     * 监听 WebSocket 错误。
     */
    onError(CALLBACK?: SocketTask.onError.Param): void
    /**
     *
     * **SocketTask.onMessage(CALLBACK)：**
     *
     * 监听WebSocket接受到服务器的消息事件。
     */
    onMessage<T = any>(CALLBACK: SocketTask.onMessage.Param<T>): void
  }
}
