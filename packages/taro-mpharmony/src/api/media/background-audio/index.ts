import { temporarilyNotSupport } from '../../../utils'
import { BackgroundAudioManager } from './BackgroundAudioManager'

/**
 * 停止播放音乐
 * 
 * @canNotUse stopBackgroundAudio
 */
export const stopBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('stopBackgroundAudio')

/**
 * 控制音乐播放进度
 * 
 * @canNotUse seekBackgroundAudio
 */
export const seekBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('seekBackgroundAudio')

/**
 * 使用后台播放器播放音乐
 * 
 * @canNotUse playBackgroundAudio
 */
export const playBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('playBackgroundAudio')

/**
 * 暂停播放音乐
 * 
 * @canNotUse pauseBackgroundAudio
 */
export const pauseBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('pauseBackgroundAudio')

/**
 * 监听音乐停止
 * 
 * @canNotUse onBackgroundAudioStop
 */
export const onBackgroundAudioStop = /* @__PURE__ */ temporarilyNotSupport('onBackgroundAudioStop')

/**
 * 监听音乐播放
 * 
 * @canNotUse onBackgroundAudioPlay
 */
export const onBackgroundAudioPlay = /* @__PURE__ */ temporarilyNotSupport('onBackgroundAudioPlay')

/**
 * 监听音乐暂停
 * 
 * @canNotUse onBackgroundAudioPause
 */
export const onBackgroundAudioPause = /* @__PURE__ */ temporarilyNotSupport('onBackgroundAudioPause')

/**
 * 获取后台音乐播放状态
 * 
 * @canNotUse getBackgroundAudioPlayerState
 */
export const getBackgroundAudioPlayerState = /* @__PURE__ */ temporarilyNotSupport('getBackgroundAudioPlayerState')

/**
 * 获取全局唯一的背景音频管理器
 * 
 * @canUse getBackgroundAudioManager
 */
export const getBackgroundAudioManager = () => new BackgroundAudioManager()
