import Taro from '../../index'

declare module '../../index' {
  /** 一个 TCP Socket 实例，默认使用 IPv4 协议
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.html
   */
  interface TCPSocket {
    /** 在给定的套接字上启动连接
     * @supported weapp
     * @example
     * ```tsx
     * const tcp = Taro.createTCPSocket()
     * tcp.connect({ address: '192.168.193.2', port: 8848 })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.connect.html
     */
    connect(option: TCPSocket.connect.Option): void
    /** 在 socket 上发送数据
     * @supported weapp
     * @example
     * ```tsx
     * const tcp = Taro.createTCPSocket()
     * tcp.write('hello, how are you')
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.write.html
     */
    write(
      /** 要发送的数据 */
      data: string | ArrayBuffer
    ): void
    /** 关闭连接
     * @supported weapp
     * @example
     * ```tsx
     * const tcp = Taro.createTCPSocket()
     * tcp.close()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.close.html
     */
    close(): void
    /** 监听关闭事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.onClose.html
     */
    onClose(
      /** 当一个 socket 完全关闭就发出该事件的回调函数 */
      callback: TCPSocket.onClose.Callback,
    ): void
    /** 取消监听当一个 socket 完全关闭就发出该事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.offClose.html
     */
    offClose(
      /** 当一个 socket 完全关闭就发出该事件的回调函数 */
      callback: TCPSocket.onClose.Callback,
    ): void
    /** 监听当一个 socket 连接成功建立的时候触发该事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.onConnect.html
     */
    onConnect(
      /** 当一个 socket 连接成功建立的时候触发该事件的回调函数 */
      callback: TCPSocket.onConnect.Callback,
    ): void
    /** 取消监听当一个 socket 连接成功建立的时候触发该事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.offConnect.html
     */
    offConnect(
      /** 当一个 socket 连接成功建立的时候触发该事件的回调函数 */
      callback: TCPSocket.onConnect.Callback,
    ): void
    /** 监听当错误发生时触发
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.onError.html
     */
    onError(
      /** 监听当错误发生时触发的回调函数 */
      callback: TCPSocket.onError.Callback,
    ): void
    /** 取消监听当错误发生时触发
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.offError.html
     */
    offError(
      /** 监听当错误发生时触发的回调函数 */
      callback: TCPSocket.onError.Callback,
    ): void
    /** 监听当接收到数据的时触发该事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.onMessage.html
     */
    onMessage(
      /** 当接收到数据的时触发该事件的回调函数 */
      callback: TCPSocket.onMessage.Callback,
    ): void
    /** 取消监听当接收到数据的时触发该事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.offMessage.html
     */
    offMessage(
      /** 当接收到数据的时触发该事件的回调函数 */
      callback: TCPSocket.onMessage.Callback,
    ): void
  }

  namespace TCPSocket {
    namespace connect {
      interface Option {
        /** 套接字要连接的地址 */
        address: string
        /** 套接字要连接的端口 */
        port: number
      }
    }
    namespace onClose {
      /** 当一个 socket 完全关闭就发出该事件的回调函数 */
      type Callback = (...args: unknown[]) => void
    }
    namespace onConnect {
      /** 当一个 socket 连接成功建立的时候触发该事件的回调函数 */
      type Callback = (...args: unknown[]) => void
    }
    namespace onError {
      /** 监听当错误发生时触发的回调函数 */
      type Callback = (result: CallbackResult) => void
      interface CallbackResult extends TaroGeneral.CallbackResult {
        /** 错误信息 */
        errMsg: string
      }
    }
    namespace onMessage {
      /** 当接收到数据的时触发该事件的回调函数 */
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
        /** message 的大小，单位：字节 */
        size: number
      }
      /** 接收端地址信息 */
      interface LocalInfo {
        /** 接收消息的 socket 的地址 */
        address: string
        /** 使用的协议族，为 IPv4 或者 IPv6 */
        family: string
        /** 端口号 */
        port: number
      }
    }
  }

  interface TaroStatic {
    /** 创建一个 TCP Socket 实例。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。
     *
     * **连接限制**
     *
     * - 允许与局域网内的非本机 IP 通信
     * - 允许与配置过的服务器域名通信，详见[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)
     * - 禁止与以下端口号连接：1024 以下 1099 1433 1521 1719 1720 1723 2049 2375 3128 3306 3389 3659 4045 5060 5061 5432 5984 6379 6000 6566 7001 7002 8000-8100 8443 8888 9200 9300 10051 10080 11211 27017 27018 27019
     * - 每 5 分钟内最多创建 20 个 TCPSocket
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/wx.createTCPSocket.html
     */
    createTCPSocket(): TCPSocket
  }
}
