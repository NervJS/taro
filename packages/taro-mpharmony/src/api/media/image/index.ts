import Taro from '@tarojs/api'

import { permanentlyNotSupport, temporarilyNotSupport } from '../../../utils'

// 图片
export * from './saveImageToPhotosAlbum'
export const previewMedia: typeof Taro.previewMedia = /* @__PURE__ */ temporarilyNotSupport('previewMedia')

export * from './getImageInfo'
export * from './previewImage'

export const compressImage = /* @__PURE__ */ temporarilyNotSupport('compressImage')
export const chooseMessageFile = /* @__PURE__ */ permanentlyNotSupport('chooseMessageFile')

export * from './chooseImage'

export const editImage = /* @__PURE__ */ temporarilyNotSupport('editImage')
export const cropImage = /* @__PURE__ */ temporarilyNotSupport('cropImage')
