import Taro from '@tarojs/api'

import { findDOM, temporarilyNotSupport } from '../../../utils'

// 视频
export const saveVideoToPhotosAlbum: typeof Taro.saveVideoToPhotosAlbum = temporarilyNotSupport('saveVideoToPhotosAlbum')
export const openVideoEditor = temporarilyNotSupport('openVideoEditor')
export const getVideoInfo = temporarilyNotSupport('getVideoInfo')

/**
 * 创建 video 上下文 VideoContext 对象。
 */
export const createVideoContext: typeof Taro.createVideoContext = (id, inst) => {
  const el = findDOM(inst) as HTMLVideoElement
  // TODO HTMLVideoElement to VideoContext
  return el?.querySelector(`taro-video-core[id=${id}]`) as unknown as Taro.VideoContext
}

export const compressVideo = temporarilyNotSupport('compressVideo')

export * from './chooseMedia'
export * from './chooseVideo'
