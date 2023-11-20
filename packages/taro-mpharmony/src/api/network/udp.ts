import { temporarilyNotSupport } from '../../utils'

/**
 * 创建一个 UDP Socket 实例
 * 
 * @canNotUse createUDPSocket
 */
export const createUDPSocket = /* @__PURE__ */ temporarilyNotSupport('createUDPSocket')

/**
 * 一个 UDP Socket 实例，默认使用 IPv4 协议
 * 
 * @canNotUse UDPSocket
 */