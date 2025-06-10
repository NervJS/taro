import { temporarilyNotSupport } from '../../../utils'
import { BackgroundAudioManager } from './BackgroundAudioManager'

// 背景音频
export const stopBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('stopBackgroundAudio')
export const seekBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('seekBackgroundAudio')
export const playBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('playBackgroundAudio')
export const pauseBackgroundAudio = /* @__PURE__ */ temporarilyNotSupport('pauseBackgroundAudio')
export const onBackgroundAudioStop = /* @__PURE__ */ temporarilyNotSupport('onBackgroundAudioStop')
export const onBackgroundAudioPlay = /* @__PURE__ */ temporarilyNotSupport('onBackgroundAudioPlay')
export const onBackgroundAudioPause = /* @__PURE__ */ temporarilyNotSupport('onBackgroundAudioPause')
export const getBackgroundAudioPlayerState = /* @__PURE__ */ temporarilyNotSupport('getBackgroundAudioPlayerState')

/**
 * 获取全局唯一的背景音频管理器
 */
export const getBackgroundAudioManager = () => new BackgroundAudioManager()
