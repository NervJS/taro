import { temporarilyNotSupport } from '../../utils'

/**
 * 创建 live-pusher 上下文 LivePusherContext 对象
 * 
 * @canNotUse createLivePusherContext
 */
export const createLivePusherContext = /* @__PURE__ */ temporarilyNotSupport('createLivePusherContext')

/**
 * LivePusherContext 实例
 * 
 * @canNotUse LivePusherContext 
 */

/**
 * 加入（创建）双人通话
 * 
 * @canNotUse join1v1Chat
 */

export const join1v1Chat = /* @__PURE__ */ temporarilyNotSupport('join1v1Chat')

export * from './audio'
export * from './background-audio'
export * from './camera'
export * from './image'
export * from './live/createLivePlayerContext'
export * from './map'
export * from './media-recorder'
export * from './recorder'
export * from './video'
export * from './video-decoder'
export * from './video-processing'
export * from './voip'
