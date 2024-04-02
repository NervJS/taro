/**
 * 获取网络类型
 * 
 * @canUse getNetworkType
 * @__success [networkType[wifi, 2g, 3g, 4g, 5g, unknown, none]] 
 */
export { getNetworkType } from '@tarojs/taro-h5'

/**
 * 在最近的八次网络请求中, 出现下列三个现象之一则判定弱网。
 * - 出现三次以上连接超时
 * - 出现三次 rtt 超过 400
 * - 出现三次以上的丢包
 * > 弱网事件通知规则是: 弱网状态变化时立即通知, 状态不变时 30s 内最多通知一次。
 * 
 * @canNotUse onNetworkWeakChange
 */
export { onNetworkWeakChange } from '@tarojs/taro-h5'

/**
 * 监听网络状态变化
 * 
 * @canUse onNetworkStatusChange
 * @__success [isConnected, networkType[wifi, 2g, 3g, 4g, 5g, unknown, none]]
 */
export { onNetworkStatusChange } from '@tarojs/taro-h5'

/**
 * 取消监听弱网状态变化事件
 * 
 * @canNotUse offNetworkWeakChange
 */
export { offNetworkWeakChange } from '@tarojs/taro-h5'

/**
 * 取消监听网络状态变化事件，参数为空，则取消所有的事件监听
 * 
 * @canUse offNetworkStatusChange
 */
export { offNetworkStatusChange } from '@tarojs/taro-h5'

/**
 * 获取局域网IP地址
 * 
 * @canNotUse getLocalIPAddress
 */
export { getLocalIPAddress } from '@tarojs/taro-h5'