/**
 * 通过 WebSocket 连接发送数据
 * 
 * @canNotUse sendSocketMessage
 */
export { sendSocketMessage } from '@tarojs/taro-h5'

/**
 * 监听 WebSocket 连接打开事件
 * 
 * @canNotUse onSocketOpen
 */
export { onSocketOpen } from '@tarojs/taro-h5'

/**
 * 监听 WebSocket 接受到服务器的消息事件
 * 
 * @canNotUse onSocketMessage
 */
export { onSocketMessage } from '@tarojs/taro-h5'

/**
 * 监听 WebSocket 错误事件
 * 
 * @canNotUse onSocketError
 */
export { onSocketError } from '@tarojs/taro-h5'

/**
 * 监听 WebSocket 连接关闭事件
 * 
 * @canNotUse onSocketClose
 */
export { onSocketClose } from '@tarojs/taro-h5'

/**
 * 创建一个 WebSocket 连接
 * 
 * @canUse connectSocket
 * @__object [url, header, protocols, tcpNoDelay]
 */
export { connectSocket } from '@tarojs/taro-h5'

/**
 * 关闭 WebSocket 连接
 * 
 * @canNotUse closeSocket
 */
export { closeSocket } from '@tarojs/taro-h5'

/**
 * WebSocket 任务
 * 
 * @canUse SocketTask
 * @__class [send, close, onOpen, onClose, onError, onMessage]
 */