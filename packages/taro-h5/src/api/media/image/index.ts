import Taro from '@tarojs/api'

import { permanentlyNotSupport, temporarilyNotSupport } from '../../../utils'

// 图片
export const saveImageToPhotosAlbum: typeof Taro.saveImageToPhotosAlbum = temporarilyNotSupport('saveImageToPhotosAlbum')
export const previewMedia: typeof Taro.saveImageToPhotosAlbum = temporarilyNotSupport('previewMedia')

export * from './getImageInfo'
export * from './previewImage'

export const compressImage = temporarilyNotSupport('compressImage')
export const chooseMessageFile = permanentlyNotSupport('chooseMessageFile')

export * from './chooseImage'

export const editImage = temporarilyNotSupport('editImage')
export const cropImage = temporarilyNotSupport('cropImage')
