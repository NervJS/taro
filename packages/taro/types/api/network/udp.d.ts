declare namespace Taro {
  /** 创建一个 UDP Socket 实例。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/wx.createUDPSocket.html
   */
  function createUDPSocket(): UDPSocket

  /** 一个 UDP Socket 实例，默认使用 IPv4 协议。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.html
   */
  interface UDPSocket {
    /** 关闭 UDP Socket 实例，相当于销毁。 在关闭之后，UDP Socket 实例不能再发送消息，每次调用 `UDPSocket.send` 将会触发错误事件，并且 message 事件回调函数也不会再也执行。在 `UDPSocket` 实例被创建后将被 Native 强引用，保证其不被 GC。在 `UDPSocket.close` 后将解除对其的强引用，让 UDPSocket 实例遵从 GC。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.close.html
     */
    close(): void
    /** 取消监听关闭事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offClose.html
     */
    offClose(
      /** 关闭事件的回调函数 */
      callback: UDPSocket.OffCloseCallback,
    ): void
    /** 取消监听错误事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offError.html
     */
    offError(
      /** 错误事件的回调函数 */
      callback: UDPSocket.OffErrorCallback,
    ): void
    /** 取消监听开始监听数据包消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offListening.html
     */
    offListening(
      /** 开始监听数据包消息的事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 取消监听收到消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offMessage.html
     */
    offMessage(
      /** 收到消息的事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 监听关闭事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onClose.html
     */
    onClose(
      /** 关闭事件的回调函数 */
      callback: UDPSocket.OnCloseCallback,
    ): void
    /** 监听错误事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onError.html
     */
    onError(
      /** 错误事件的回调函数 */
      callback: UDPSocket.OnErrorCallback,
    ): void
    /** 监听开始监听数据包消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onListening.html
     */
    onListening(
      /** 开始监听数据包消息的事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 监听收到消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onMessage.html
     */
    onMessage(
      /** 收到消息的事件的回调函数 */
      callback: UDPSocket.OnMessageCallback,
    ): void
    /** 向指定的 IP 和 port 发送消息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.send.html
     */
    send(option: UDPSocket.SendOption): void
    /** 绑定一个系统随机分配的可用端口，或绑定一个指定的端口号
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.bind.html
     */
    bind(
      /** 指定要绑定的端口号 */
      port: number,
    ): number
  }

  namespace UDPSocket {
    /** 关闭事件的回调函数 */
    type OffCloseCallback = (res: General.CallbackResult) => void
    /** 错误事件的回调函数 */
    type OffErrorCallback = (res: General.CallbackResult) => void
    /** 关闭事件的回调函数 */
    type OnCloseCallback = (res: General.CallbackResult) => void
    /** 错误事件的回调函数 */
    type OnErrorCallback = (
        result: OnErrorCallbackResult,
    ) => void
    /** 收到消息的事件的回调函数 */
    type OnMessageCallback = (
        result: OnMessageCallbackResult,
    ) => void
    interface OnErrorCallbackResult extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
    }
    interface OnMessageCallbackResult {
      /** 收到的消息 */
      message: ArrayBuffer
      /** 消息来源的结构化信息 */
      remoteInfo: RemoteInfo
    }
    /** 消息来源的结构化信息 */
    interface RemoteInfo {
      /** 发送消息的 socket 的地址 */
      address: string
      /** 使用的协议族，为 IPv4 或者 IPv6 */
      family: string
      /** 端口号 */
      port: number
      /** message 的大小，单位：字节 */
      size: number
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
}
