/**
 * 获取通用AI推理引擎版本
 * 
 * @canNotUse getInferenceEnvInfo
 */
export { getInferenceEnvInfo } from '@tarojs/taro-h5'

/**
 * 创建 AI 推理 Session
 * 
 * @canNotUse createInferenceSession
 */
export { createInferenceSession } from '@tarojs/taro-h5'

/**
 * InferenceSession类
 * 
 * @canNotUse InferenceSession
 */

export * from './facial'
export * from './inference'
export * from './visual'
