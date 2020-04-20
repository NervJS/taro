declare namespace Taro {
  namespace sendSocketMessage {
    interface Option {
      /** 需要发送的内容 */
      data: string | ArrayBuffer
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 通过 WebSocket 连接发送数据。需要先 Taro.connectSocket，并在 Taro.onSocketOpen 回调之后才能发送。
   * @supported weapp, alipay, swan
   * @example
   * ```tsx
   * let socketOpen = false
   * const socketMsgQueue = []
   * Taro.connectSocket({
   *   url: 'test.php'
   * })
   * Taro.onSocketOpen(function(res) {
   *   socketOpen = true
   *   for (let i = 0; i < socketMsgQueue.length; i++){
   *     sendSocketMessage(socketMsgQueue[i])
   *   }
   *   socketMsgQueue = []
   * })
   * function sendSocketMessage(msg) {
   *   if (socketOpen) {
   *     Taro.sendSocketMessage({
   *       data:msg
   *     })
   *   } else {
   *     socketMsgQueue.push(msg)
   *   }
   * }
   * ```
   @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.sendSocketMessage.html
   */
  function sendSocketMessage(option: sendSocketMessage.Option): Promise<General.CallbackResult>

  namespace onSocketOpen {
    /** WebSocket 连接打开事件的回调函数 */
    type Callback = (result: OpenCallbackResult) => void
    interface OpenCallbackResult {
      /** 连接成功的 HTTP 响应 Header */
      header: General.IAnyObject
    }
  }
  /** 监听 WebSocket 连接打开事件
   * @supported weapp, alipay, swan
   * @example
   * ```tsx
   * Taro.connectSocket({
   *   url: 'test.php'
   * })
   * Taro.onSocketOpen(function (res) {
   *   console.log('WebSocket连接已打开！')
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketOpen.html
   */
  function onSocketOpen(
    /** WebSocket 连接打开事件的回调函数 */
    callback: onSocketOpen.Callback,
  ): void

  namespace onSocketMessage {
    /** WebSocket 接受到服务器的消息事件的回调函数 */
    type Callback < T = any > = (
      result: CallbackResult<T>,
    ) => void
    interface CallbackResult < T extends any | string | ArrayBuffer = any > {
      /** 服务器返回的消息 */
      data: T
    }
  }

  /** 监听 WebSocket 接受到服务器的消息事件
   * @supported weapp, alipay, swan
   * @example
   * ```tsx
   * Taro.connectSocket({
   *   url: 'test.php'
   * })
   * Taro.onSocketMessage(function (res) {
   *   console.log('收到服务器内容：' + res.data)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketMessage.html
   */
  function onSocketMessage<T = any>(
    /** WebSocket 接受到服务器的消息事件的回调函数 */
    callback: onSocketMessage.Callback<T>,
  ): void

  namespace onSocketError {
    /** WebSocket 错误事件的回调函数 */
    type Callback = (result: CallbackResult) => void
    interface CallbackResult extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
    }
  }
  /** 监听 WebSocket 错误事件
   * @supported weapp, alipay, swan
   * @example
   * ```tsx
   * Taro.connectSocket({
   *   url: 'test.php'
   * })
   * Taro.onSocketOpen(function (res){
   *   console.log('WebSocket连接已打开！')
   * })
   * Taro.onSocketError(function (res){
   *   console.log('WebSocket连接打开失败，请检查！')
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketError.html
   */
  function onSocketError(
    /** WebSocket 错误事件的回调函数 */
    callback: (result: onSocketError.Callback) => void,
  ): void

  namespace onSocketClose {
    /** WebSocket 连接关闭事件的回调函数 */
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      /** 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 */
      code: number
      /** 一个可读的字符串，表示连接被关闭的原因。 */
      reason: string
    }
  }
  /** 监听 WebSocket 连接关闭事件
   * @supported weapp, alipay, swan
   * @example
   * ```tsx
   * Taro.connectSocket({
   *   url: 'test.php'
   * })
   * //注意这里有时序问题，
   * //如果 Taro.connectSocket 还没回调 Taro.onSocketOpen，而先调用 Taro.closeSocket，那么就做不到关闭 WebSocket 的目的。
   * //必须在 WebSocket 打开期间调用 Taro.closeSocket 才能关闭。
   * Taro.onSocketOpen(function () {
   *   Taro.closeSocket()
   * })
   * Taro.onSocketClose(function (res) {
   *   console.log('WebSocket 已关闭！')
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketClose.html
   */
  function onSocketClose(
    /** WebSocket 连接关闭事件的回调函数 */
    callback: onSocketClose.Callback,
  ): void

  namespace connectSocket {
    interface Option {
      /** 开发者服务器 wss 接口地址 */
      url: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** HTTP Header，Header 中不能设置 Referer */
      header?: General.IAnyObject
      /** 子协议数组 */
      protocols?: string[]
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
      /** 建立 TCP 连接的时候的 TCP_NODELAY 设置 */
      tcpNoDelay?: boolean
    }
  }

  /** 创建一个 WebSocket 连接。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。
   *
   * **并发数**
   * - 1.7.0 及以上版本，最多可以同时存在 5 个 WebSocket 连接。
   * - 1.7.0 以下版本，一个小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。
   * @supported weapp, h5, rn, alipay, swan
   * @example
   * ```tsx
   * Taro.connectSocket({
   *   url: 'wss://example.qq.com',
   *   header:{
   *     'content-type': 'application/json'
   *   },
   *   protocols: ['protocol1']
   * })
   * ```
   * @example
   * ```tsx
   * Taro.connectSocket({
   *   url: 'ws://echo.websocket.org/echo',
   *   success: function () {
   *     console.log('connect success')
   *   }
   * }).then(task => {
   *   task.onOpen(function () {
   *     console.log('onOpen')
   *     task.send({ data: 'xxx' })
   *   })
   *   task.onMessage(function (msg) {
   *     console.log('onMessage: ', msg)
   *     task.close()
   *   })
   *   task.onError(function () {
   *     console.log('onError')
   *   })
   *   task.onClose(function (e) {
   *     console.log('onClose: ', e)
   *   })
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html
   */
  function connectSocket(option: connectSocket.Option): Promise<SocketTask>

  namespace closeSocket {
    interface Option {
      /** 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 */
      code?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。 */
      reason?: string
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 关闭 WebSocket 连接
   * @supported weapp, alipay, swan
   * @example
   * ```tsx
   * Taro.connectSocket({
   *   url: 'test.php'
   * })
   * //注意这里有时序问题，
   * //如果 Taro.connectSocket 还没回调 Taro.onSocketOpen，而先调用 Taro.closeSocket，那么就做不到关闭 WebSocket 的目的。
   * //必须在 WebSocket 打开期间调用 Taro.closeSocket 才能关闭。
   * Taro.onSocketOpen(function() {
   *   Taro.closeSocket()
   * })
   * Taro.onSocketClose(function(res) {
   *   console.log('WebSocket 已关闭！')
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.closeSocket.html
   */
  function closeSocket(option?: closeSocket.Option): Promise<General.CallbackResult>

  namespace SocketTask {
    interface CloseOption {
      /** 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 */
      code?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。 */
      reason?: string
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    /** WebSocket 连接关闭事件的回调函数 */
    type OnCloseCallback = (
      result: OnCloseCallbackResult,
    ) => void
    interface OnCloseCallbackResult {
      /** 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 */
      code: number
      /** 一个可读的字符串，表示连接被关闭的原因。 */
      reason: string
    }
    /** WebSocket 错误事件的回调函数 */
    type OnErrorCallback = (
      result: OnErrorCallbackResult,
    ) => void
    interface OnErrorCallbackResult extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
    }
    /** WebSocket 接受到服务器的消息事件的回调函数 */
    type OnMessageCallback< T = any > = (
      result: OnMessageCallbackResult<T>,
    ) => void
    interface OnMessageCallbackResult< T extends any | string | ArrayBuffer = any >{
      /** 服务器返回的消息 */
      data: T
    }
    /** WebSocket 连接打开事件的回调函数 */
    type OnOpenCallback = (result: OnOpenCallbackResult) => void
    interface OnOpenCallbackResult {
      /** 连接成功的 HTTP 响应 Header*/
      header: General.IAnyObject
    }
    interface SendOption {
      /** 需要发送的内容 */
      data: string | ArrayBuffer
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** WebSocket 任务，可通过 [Taro.connectSocket()](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html) 接口创建返回。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html
   */
  interface SocketTask {
    /** 关闭 WebSocket 连接
     * @supported weapp, h5, rn, alipay, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.close.html
     */
    close(option: SocketTask.CloseOption): void
    /** 监听 WebSocket 连接关闭事件
     * @supported weapp, h5, rn, alipay, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onClose.html
     */
    onClose(
      /** WebSocket 连接关闭事件的回调函数 */
      callback: SocketTask.OnCloseCallback,
    ): void
    /** 监听 WebSocket 错误事件
     * @supported weapp, h5, rn, alipay, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onError.html
     */
    onError(
      /** WebSocket 错误事件的回调函数 */
      callback: SocketTask.OnErrorCallback,
    ): void
    /** 监听 WebSocket 接受到服务器的消息事件
     * @supported weapp, h5, rn, alipay, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onMessage.html
     */
    onMessage<T = any>(
      /** WebSocket 接受到服务器的消息事件的回调函数 */
      callback: SocketTask.OnMessageCallback<T>,
    ): void
    /** 监听 WebSocket 连接打开事件
     * @supported weapp, h5, rn, alipay, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onOpen.html
     */
    onOpen(
      /** WebSocket 连接打开事件的回调函数 */
      callback: SocketTask.OnOpenCallback,
    ): void
    /** 通过 WebSocket 连接发送数据
     * @supported weapp, h5, rn, alipay, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.send.html
     */
    send(option: SocketTask.SendOption): void

    /** websocket 当前的连接 ID。 */
    readonly socketTaskId: number
    /** websocket 当前的连接状态。 */
    readonly readyState: number
    /** websocket 接口调用结果。 */
    readonly errMsg: string
    /** websocket 状态值：连接中。 */
    readonly CONNECTING: number
    /** websocket 状态值：已连接。 */
    readonly OPEN: number
    /** websocket 状态值：关闭中。 */
    readonly CLOSING: number
    /** websocket 状态值：已关闭。 */
    readonly CLOSED: number
    /** 浏览器 websocket 实例。（h5 端独有） */
    readonly ws: WebSocket
  }
}
