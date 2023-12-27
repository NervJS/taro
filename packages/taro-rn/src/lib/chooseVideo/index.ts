import { chooseMedia, MEDIA_TYPE } from '../media'
import { showActionSheet } from '../showActionSheet'

export function chooseVideo(opts: Taro.chooseVideo.Option): Promise<any> {
  const {
    sourceType = ['album', 'camera'],
    compressed
  } = opts
  opts = Object.assign(opts, { sizeType: compressed ? ['compressed'] : [] })
  if(sourceType?.includes('camera') && sourceType?.includes('album')) {
    return showVideoPicker(opts)
  } else if (sourceType?.includes('camera')) {
    return chooseMedia({...opts, sourceType: ['camera']}, MEDIA_TYPE.VIDEOS)
  }
  return chooseMedia({...opts, sourceType: ['album']}, MEDIA_TYPE.VIDEOS)
}

async function showVideoPicker(options: Taro.chooseVideo.Option):Promise<any> {
  const { fail, complete } = options
  try {
    const res = await showActionSheet({
      itemList: ['拍摄', '从手机相册选择'],
    })
    if (res.tapIndex === 0) {
      return chooseMedia({...options, sourceType: ['camera']}, MEDIA_TYPE.VIDEOS)
    }
    if (res.tapIndex === 1) {
      return chooseMedia({...options, sourceType: ['album']}, MEDIA_TYPE.VIDEOS)
    }
  } catch (err) {
    const res = { errMsg: 'chooseVideo: fail' }
    fail?.(res)
    complete?.(res)
  }
}
