// 图片
export * from './compressImage'
export * from './getImageInfo'
export * from './previewImage'
export * from './previewMedia'
export * from './saveImageToPhotosAlbum'

/**
 * 从客户端会话选择文件
 * 
 * @canNotUse chooseMessageFile
 */
export * from './chooseImage'
export { chooseMessageFile } from '@tarojs/taro-h5'

/**
 * 编辑图片接口
 * 
 * @canNotUse editImage
 */
export { editImage } from '@tarojs/taro-h5'

/**
 * 裁剪图片接口
 * 
 * @canNotUse cropImage
 */
export { cropImage } from '@tarojs/taro-h5'
