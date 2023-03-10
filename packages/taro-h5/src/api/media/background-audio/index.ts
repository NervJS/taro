/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
