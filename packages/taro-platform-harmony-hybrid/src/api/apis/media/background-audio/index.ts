/**
 * 停止播放音乐
 * 
 * @canNotUse stopBackgroundAudio
 */
export { stopBackgroundAudio } from '@tarojs/taro-h5'

/**
 * 控制音乐播放进度
 * 
 * @canNotUse seekBackgroundAudio
 */
export { seekBackgroundAudio } from '@tarojs/taro-h5'

/**
 * 使用后台播放器播放音乐
 * 
 * @canNotUse playBackgroundAudio
 */
export { playBackgroundAudio } from '@tarojs/taro-h5'

/**
 * 暂停播放音乐
 * 
 * @canNotUse pauseBackgroundAudio
 */
export { pauseBackgroundAudio } from '@tarojs/taro-h5'

/**
 * 监听音乐停止
 * 
 * @canNotUse onBackgroundAudioStop
 */
export { onBackgroundAudioStop } from '@tarojs/taro-h5'

/**
 * 监听音乐播放
 * 
 * @canNotUse onBackgroundAudioPlay
 */
export { onBackgroundAudioPlay } from '@tarojs/taro-h5'

/**
 * 监听音乐暂停
 * 
 * @canNotUse onBackgroundAudioPause
 */
export { onBackgroundAudioPause } from '@tarojs/taro-h5'

/**
 * 获取后台音乐播放状态
 * 
 * @canNotUse getBackgroundAudioPlayerState
 */
export { getBackgroundAudioPlayerState } from '@tarojs/taro-h5'

/**
 * 获取全局唯一的背景音频管理器
 * 
 * @canUse getBackgroundAudioManager
 */
export { getBackgroundAudioManager } from '@tarojs/taro-h5'

/**
 * BackgroundAudioManager 实例
 * 
 * @canUse BackgroundAudioManager
 * @__class 
 * [play, pause, seek, stop, onCanplay, onWaiting, onError, onPlay, onPause, onSeeking,\
 * onSeeked, onEnded, onStop, onTimeUpdate]
 */