import Taro from '@tarojs/api'

/**
 * 延迟一部分操作到下一个时间片再执行
 * 
 * @canUse nextTick
 */
export const nextTick = Taro.nextTick
