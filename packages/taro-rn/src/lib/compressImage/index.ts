import ImageResizer, { ResizeFormat } from '@bam.tech/react-native-image-resizer'
import { Image } from 'react-native'
import { errorHandler, successHandler } from '../../utils'

/**
 * 压缩图片
 * @param opts
 */
export async function compressImage(opt: Taro.compressImage.Option): Promise<Taro.compressImage.SuccessCallbackResult> {
  const {
    src,
    quality = 80,
    success,
    fail,
    complete
  } = opt

  const res = { errMsg: 'compressImage:ok', tempFilePath: '' }

  const _createResizedImage = async (width = 800, height = 800) => {
    try {
      const compressFormat: ResizeFormat = src.toLocaleLowerCase().endsWith('.png') ? 'PNG' : 'JPEG'
      const { uri } = await ImageResizer.createResizedImage(src, width, height, compressFormat, quality)
      res.tempFilePath = uri
      return successHandler(success, complete)(res)
    } catch (err) {
      res.errMsg = err.message
      return errorHandler(fail, complete)(res)
    }
  }

  return Image.getSize(src, async (width, height) => {
    return await _createResizedImage(width, height)
  }, async () => {
    return await _createResizedImage()
  })
}
