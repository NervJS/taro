import { permanentlyNotSupport, temporarilyNotSupport } from '../../../utils'

// 图片
export * from './compressImage'
export * from './getImageInfo'
export * from './previewImage'
export * from './previewMedia'
export * from './saveImageToPhotosAlbum'

export const chooseMessageFile = /* @__PURE__ */ permanentlyNotSupport('chooseMessageFile')

export * from './chooseImage'

export const editImage = /* @__PURE__ */ temporarilyNotSupport('editImage')
export const cropImage = /* @__PURE__ */ temporarilyNotSupport('cropImage')
