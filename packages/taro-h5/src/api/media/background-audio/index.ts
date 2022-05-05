import { temporarilyNotSupport } from '../../../utils'
import { BackgroundAudioManager } from './BackgroundAudioManager'

// 背景音频
export const stopBackgroundAudio = temporarilyNotSupport('stopBackgroundAudio')
export const seekBackgroundAudio = temporarilyNotSupport('seekBackgroundAudio')
export const playBackgroundAudio = temporarilyNotSupport('playBackgroundAudio')
export const pauseBackgroundAudio = temporarilyNotSupport('pauseBackgroundAudio')
export const onBackgroundAudioStop = temporarilyNotSupport('onBackgroundAudioStop')
export const onBackgroundAudioPlay = temporarilyNotSupport('onBackgroundAudioPlay')
export const onBackgroundAudioPause = temporarilyNotSupport('onBackgroundAudioPause')
export const getBackgroundAudioPlayerState = temporarilyNotSupport('getBackgroundAudioPlayerState')

/**
 * 获取全局唯一的背景音频管理器
 */
export const getBackgroundAudioManager = () => new BackgroundAudioManager()
