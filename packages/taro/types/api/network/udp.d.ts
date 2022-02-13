import Taro from '../../index'

declare module '../../index' {
  /** 一个 UDP Socket 实例，默认使用 IPv4 协议。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.html
   */
  interface UDPSocket {
    /** 绑定一个系统随机分配的可用端口，或绑定一个指定的端口号
     * @supported weapp
     * @example
     * ```tsx
     * const udp = Taro.createUDPSocket()
     * udp.close()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.bind.html
     */
    bind(
      /** 指定要绑定的端口号，不传则返回系统随机分配的可用端口 */
      port: number,
    ): number
    /** 设置 IP_TTL 套接字选项，用于设置一个 IP 数据包传输时允许的最大跳步数
     * @supported weapp
     * @example
     * ```tsx
     * const udp = Taro.createUDPSocket()
     * udp.onListening(function () {
     *   udp.setTTL(64)
     * })
     * udp.bind()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.setTTL.html
     */
    setTTL(
      /** ttl 参数可以是 0 到 255 之间 */
      ttl: number
    ): void
    /** 向指定的 IP 和 port 发送消息
     * @supported weapp
     * @example
     * ```tsx
     * const udp = Taro.createUDPSocket()
     * udp.bind()
     * udp.send({
     *   address: '192.168.193.2',
     *   port: 8848,
     *   message: 'hello, how are you'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.send.html
     */
    send(option: UDPSocket.send.Option): void
    /** 预先连接到指定的 IP 和 port，需要配合 write 方法一起使用
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.connect.html
     */
    connect(option: UDPSocket.connect.Option): void
    /** 用法与 send 方法相同，如果没有预先调用 connect 则与 send 无差异（注意即使调用了 connect 也需要在本接口填入地址和端口参数）
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.write.html
     */
    write(): void
    /** 关闭 UDP Socket 实例，相当于销毁。 在关闭之后，UDP Socket 实例不能再发送消息，每次调用 `UDPSocket.send` 将会触发错误事件，并且 message 事件回调函数也不会再也执行。在 `UDPSocket` 实例被创建后将被 Native 强引用，保证其不被 GC。在 `UDPSocket.close` 后将解除对其的强引用，让 UDPSocket 实例遵从 GC。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.close.html
     */
    close(): void
    /** 监听关闭事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onClose.html
     */
    onClose(
      /** 关闭事件的回调函数 */
      callback: UDPSocket.onClose.Callback,
    ): void
    /** 取消监听关闭事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offClose.html
     */
    offClose(
      /** 关闭事件的回调函数 */
      callback: UDPSocket.onClose.Callback,
    ): void
    /** 监听错误事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onError.html
     */
    onError(
      /** 错误事件的回调函数 */
      callback: UDPSocket.onError.Callback,
    ): void
    /** 取消监听错误事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offError.html
     */
    offError(
      /** 错误事件的回调函数 */
      callback: UDPSocket.onError.Callback,
    ): void
    /** 监听开始监听数据包消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onListening.html
     */
    onListening(
      /** 监听开始监听数据包消息的事件 */
      callback: UDPSocket.onListening.Callback,
    ): void
    /** 取消监听开始监听数据包消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offListening.html
     */
    offListening(
      /** 监听开始监听数据包消息的事件 */
      callback: UDPSocket.onListening.Callback,
    ): void
    /** 监听收到消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onMessage.html
     */
    onMessage(
      /** 收到消息的事件的回调函数 */
      callback: UDPSocket.onMessage.Callback,
    ): void
    /** 取消监听收到消息的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offMessage.html
     */
    offMessage(
      /** 收到消息的事件的回调函数 */
      callback: UDPSocket.onMessage.Callback,
    ): void
  }

  namespace UDPSocket {
    namespace connect {
      interface Option {
        /** 要发消息的地址 */
        address: string
        /** 要发送消息的端口号 */
        port: number
      }
    }
    namespace onClose {
      /** 当一个 socket 完全关闭就发出该事件的回调函数 */
      type Callback = (...args: unknown[]) => void
    }
    namespace onError {
      /** 错误事件的回调函数 */
      type Callback = (result: CallbackResult) => void
      interface CallbackResult extends TaroGeneral.CallbackResult {
        /** 错误信息 */
        errMsg: string
      }
    }
    namespace onListening {
      /** 监听开始监听数据包消息的事件 */
      type Callback = (...args: unknown[]) => void
    }
    namespace onMessage {
      /** 收到消息的事件的回调函数 */
      type Callback = (result: CallbackResult) => void
      interface CallbackResult extends TaroGeneral.CallbackResult {
        /** 收到的消息 */
        message: ArrayBuffer
        /** 发送端地址信息 */
        remoteInfo: RemoteInfo
        /** 接收端地址信息 */
        localInfo: LocalInfo
      }
      /** 发送端地址信息 */
      interface RemoteInfo {
        /** 发送消息的 socket 的地址 */
        address: string
        /** 使用的协议族，为 IPv4 或者 IPv6 */
        family: string
        /** 端口号 */
        port: number
      }
      /** 接收端地址信息 */
      interface LocalInfo {
        /** 接收消息的 socket 的地址 */
        address: string
        /** 使用的协议族，为 IPv4 或者 IPv6 */
        family: string
        /** 端口号 */
        port: number
        /** message 的大小，单位：字节 */
        size: number
      }
    }
    namespace send {
      interface Option {
        /** 要发消息的地址。在基础库 <= 2.9.3 版本必须是和本机同网段的 IP 地址，或安全域名列表内的域名地址；之后版本可以是任意 IP 和域名 */
        address: string
        /** 要发送消息的端口号 */
        port: number
        /** 要发送的数据 */
        message: string | ArrayBuffer
        /** 发送数据的偏移量，仅当 message 为 ArrayBuffer 类型时有效
         * @default 0
         */
        offset?: number
        /** 发送数据的长度，仅当 message 为 ArrayBuffer 类型时有效
         * @default message.byteLength
         */
        length?: number
      }
    }
  }

  interface TaroStatic {
    /** 创建一个 UDP Socket 实例。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/wx.createUDPSocket.html
     */
    createUDPSocket(): UDPSocket
  }
}
