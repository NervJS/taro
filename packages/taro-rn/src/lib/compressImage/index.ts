import ImageResizer from 'react-native-image-resizer'

/**
 * 压缩图片
 * @param opts
 */
export function compressImage(opt: Taro.compressImage.Option): Promise<Taro.compressImage.SuccessCallbackResult> {
  const {
    src,
    quality = 80,
    success,
    fail,
    complete
  } = opt

  const res = { errMsg: 'compressImage:ok', tempFilePath: '' }

  return new Promise((resolve, reject) => {
    return ImageResizer.createResizedImage(src, 800, 800, 'JPEG', quality, 0, '')
      .then((resp: any) => {
        res.tempFilePath = resp.uri
        success?.(res)
        complete?.(res)

        resolve(res)
      }).catch((err) => {
        res.errMsg = err
        fail?.(res)
        complete?.(res)

        reject(err)
      })
  })
}
