import { chooseMedia, MEDIA_TYPE } from '../media'
import { showActionSheet } from '../showActionSheet'

export function chooseImage(opts: Taro.chooseImage.Option): Promise<any> {
  const {
    sourceType = ['album', 'camera'],
  } = opts
  if(sourceType?.includes('camera') && sourceType?.includes('album')) {
    return showImagePicker(opts)
  } else if (sourceType?.includes('camera')) {
    return chooseMedia({...opts, sourceType: ['camera']}, MEDIA_TYPE.IMAGES)
  }
  return chooseMedia({...opts, sourceType: ['album']}, MEDIA_TYPE.IMAGES)
}

async function showImagePicker(options: Taro.chooseImage.Option):Promise<any> {
  const { fail, complete } = options
  try {
    const res = await showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
    })
    if (res.tapIndex === 0) {
      return chooseMedia({...options, sourceType: ['camera']}, MEDIA_TYPE.IMAGES)
    }
    if (res.tapIndex === 1) {
      return chooseMedia({...options, sourceType: ['album']}, MEDIA_TYPE.IMAGES)
    }
  } catch (err) {
    const res = { errMsg: 'chooseImage: fail' }
    fail?.(res)
    complete?.(res)
  }
}
