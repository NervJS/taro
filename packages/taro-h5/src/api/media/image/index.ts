import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../../utils'

// 图片
export * from './saveImageToPhotosAlbum'

export const previewMedia: typeof Taro.saveImageToPhotosAlbum = temporarilyNotSupport('previewMedia')

export * from './getImageInfo'
export * from './previewImage'

export const compressImage = temporarilyNotSupport('compressImage')
export const chooseMessageFile = temporarilyNotSupport('chooseMessageFile')

export * from './chooseImage'

export const editImage = temporarilyNotSupport('editImage')
export const cropImage = temporarilyNotSupport('cropImage')
