import { permanentlyNotSupport, temporarilyNotSupport } from '../../../utils'

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
export const chooseMessageFile = /* @__PURE__ */ permanentlyNotSupport('chooseMessageFile')

export * from './chooseImage'

/**
 * 编辑图片接口
 * 
 * @canNotUse editImage
 */
export const editImage = /* @__PURE__ */ temporarilyNotSupport('editImage')

/**
 * 裁剪图片接口
 * 
 * @canNotUse cropImage
 */
export const cropImage = /* @__PURE__ */ temporarilyNotSupport('cropImage')
