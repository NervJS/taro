import Taro from '@tarojs/api'

import { findDOM } from '../../../utils'

export const createAudioContext: typeof Taro.createAudioContext = (id, component) => {
  if (typeof id !== 'string' || !id) {
    throw new TypeError('createAudioContext: id must be a non-empty string')
  }
  const root = findDOM(component) as HTMLElement | undefined

  function findAudio () {
    if (!root?.isConnected) return
    if (root.localName === 'taro-audio-core' && root.id === id) {
      return root.querySelector('audio')
    }
    const host = Array.from(root.querySelectorAll('taro-audio-core[id]')).find(element => element.id === id)
    return host?.querySelector('audio')
  }

  return {
    play () {
      const audio = findAudio()
      audio?.play().catch(error => {
        // The public method returns void, but the native promise can reject (e.g. autoplay policy).
        console.warn('AudioContext.play:', error)
      })
    },
    pause () {
      findAudio()?.pause()
    },
    seek (position) {
      const audio = findAudio()
      if (audio && Number.isFinite(position) && position >= 0) audio.currentTime = position
    },
    setSrc (src) {
      const audio = findAudio()
      if (audio) audio.src = src
    },
  }
}
