import Taro from '@tarojs/api'

import { findDOM } from '../../../utils'

// 视频
export * from './getVideoInfo'
export * from './openVideoEditor'
export * from './saveVideoToPhotosAlbum'

/**
 * 创建 video 上下文 VideoContext 对象。
 */
export const createVideoContext: typeof Taro.createVideoContext = (id, inst) => {
  const el = findDOM(inst) as HTMLVideoElement
  // TODO HTMLVideoElement to VideoContext
  return el?.querySelector(`taro-video-core[id=${id}]`) as unknown as Taro.VideoContext
}

export * from './chooseVideo'
export * from './compressVideo'

/**
 * 拍摄视频或从手机相册中选视频。
 */
export * from './chooseMedia'