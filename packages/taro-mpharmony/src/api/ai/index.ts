import { temporarilyNotSupport } from '../../utils'

/**
 * 获取通用AI推理引擎版本
 * 
 * @canNotUse getInferenceEnvInfo
 */
export const getInferenceEnvInfo = /* @__PURE__ */ temporarilyNotSupport('getInferenceEnvInfo')

/**
 * 创建 AI 推理 Session
 * 
 * @canNotUse createInferenceSession
 */
export const createInferenceSession = /* @__PURE__ */ temporarilyNotSupport('createInferenceSession')

/**
 * InferenceSession类
 * 
 * @canNotUse InferenceSession
 */

export * from './facial'
export * from './visual'
