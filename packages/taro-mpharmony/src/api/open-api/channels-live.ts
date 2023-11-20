import { temporarilyNotSupport } from '../../utils'

/**
 * 打开视频号主页
 * 
 * @canUse openChannelsUserProfile
 * @null_implementation
 */
export const openChannelsUserProfile = () => {}

/**
 * 预约视频号直播
 * 
 * @canNotUse reserveChannelsLive
 */
export const reserveChannelsLive = /* @__PURE__ */ temporarilyNotSupport('reserveChannelsLive')

/**
 * 打开视频号直播
 * 
 * @canNotUse openChannelsLive
 */
export const openChannelsLive = /* @__PURE__ */ temporarilyNotSupport('openChannelsLive')

/**
 * 打开视频号活动页
 * 
 * @canNotUse openChannelsEvent
 */
export const openChannelsEvent = /* @__PURE__ */ temporarilyNotSupport('openChannelsEvent')

/**
 * 打开视频号视频
 * 
 * @canNotUse openChannelsActivity
 */
export const openChannelsActivity = /* @__PURE__ */ temporarilyNotSupport('openChannelsActivity')

/**
 * 获取视频号直播预告信息
 * 
 * @canNotUse getChannelsLiveNoticeInfo
 */
export const getChannelsLiveNoticeInfo = /* @__PURE__ */ temporarilyNotSupport('getChannelsLiveNoticeInfo')

/**
 * 获取视频号直播信息
 * 
 * @canNotUse getChannelsLiveInfo
 */
export const getChannelsLiveInfo = /* @__PURE__ */ temporarilyNotSupport('getChannelsLiveInfo')
