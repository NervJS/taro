// 视频
export * from './getVideoInfo'
export * from './openVideoEditor'
export * from './saveVideoToPhotosAlbum'

/**
 * 创建 video 上下文 VideoContext 对象。
 * 
 * @canUse createVideoContext
 */
export * from './chooseVideo'
export * from './compressVideo'
export { createVideoContext } from '@tarojs/taro-h5'

/**
 * 拍摄视频或从手机相册中选视频。
 */
export * from './chooseMedia'

/**
 * VideoContext 实例
 * 
 * @canUse VideoContext
 * @__class [pause, play, requestFullScreen, seek, stop]
 */