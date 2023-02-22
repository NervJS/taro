/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../../utils'
import { InnerAudioContext } from './InnerAudioContext'

// 音频

export const stopVoice = temporarilyNotSupport('stopVoice')
export const setInnerAudioOption = temporarilyNotSupport('setInnerAudioOption')
export const playVoice = temporarilyNotSupport('playVoice')
export const pauseVoice = temporarilyNotSupport('pauseVoice')
export const getAvailableAudioSources = temporarilyNotSupport('getAvailableAudioSources')
export const createWebAudioContext = temporarilyNotSupport('createWebAudioContext')
export const createMediaAudioPlayer = temporarilyNotSupport('createMediaAudioPlayer')

/**
 * 创建内部 audio 上下文 InnerAudioContext 对象。
 */
export const createInnerAudioContext: typeof Taro.createInnerAudioContext = () => new InnerAudioContext()

export const createAudioContext = temporarilyNotSupport('createAudioContext')
