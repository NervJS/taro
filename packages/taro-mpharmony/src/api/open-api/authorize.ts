/**
 * 仅小程序插件中能调用该接口
 * 
 * @canUse authorizeForMiniProgram
 * @null_implementation
 */
export const authorizeForMiniProgram = () => {}

/**
 * 提前向用户发起授权请求
 * 
 * @canNotUse authorize
 */
export { authorize } from '@tarojs/taro-h5'