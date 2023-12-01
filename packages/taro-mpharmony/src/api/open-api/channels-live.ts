/**
 * 打开视频号主页
 * 
 * @canUse openChannelsUserProfile
 * @null_implementation
 */
export const openChannelsUserProfile = () => { }

/**
 * 预约视频号直播
 * 
 * @canNotUse reserveChannelsLive
 */
export { reserveChannelsLive } from '@tarojs/taro-h5'

/**
 * 打开视频号直播
 * 
 * @canNotUse openChannelsLive
 */
export { openChannelsLive } from '@tarojs/taro-h5'

/**
 * 打开视频号活动页
 * 
 * @canNotUse openChannelsEvent
 */
export { openChannelsEvent } from '@tarojs/taro-h5'

/**
 * 打开视频号视频
 * 
 * @canNotUse openChannelsActivity
 */
export { openChannelsActivity } from '@tarojs/taro-h5'

/**
 * 获取视频号直播预告信息
 * 
 * @canNotUse getChannelsLiveNoticeInfo
 */
export { getChannelsLiveNoticeInfo } from '@tarojs/taro-h5'

/**
 * 获取视频号直播信息
 * 
 * @canNotUse getChannelsLiveInfo
 */
export { getChannelsLiveInfo } from '@tarojs/taro-h5'

/**
 * 获取视频号直播卡片/视频卡片的分享来源
 * 
 * @canNotUse getChannelsShareKey
 */
export { getChannelsShareKey } from '@tarojs/taro-h5'
