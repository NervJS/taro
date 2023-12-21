import { chooseMedia, MEDIA_TYPE } from '../media'
import { showActionSheet } from '../showActionSheet'

export function chooseImage(opts: Taro.chooseImage.Option): Promise<any> {
  const { sourceType } = opts
  switch (JSON.stringify(sourceType)) {
    case '[\'camera\']':
    case '["camera"]':
      return chooseMedia({...opts, sourceType: ['camera']}, MEDIA_TYPE.IMAGES)
    case '[\'album\']':
    case '["album"]':
      return chooseMedia({...opts, sourceType: ['album']}, MEDIA_TYPE.IMAGES)
    default:
      return showImagePicker(opts)
  }
}

function showImagePicker(options: Taro.chooseImage.Option):any {
  const { fail, complete } = options
  return new Promise((resolve, reject) => { 
    showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function (res) {
        if (res.tapIndex === 0) {
          resolve(chooseMedia({...options, sourceType: ['camera']}, MEDIA_TYPE.IMAGES))
        }
        if (res.tapIndex === 1) {
          resolve(chooseMedia({...options, sourceType: ['album']}, MEDIA_TYPE.IMAGES))
        }
      },
      fail: function () {
        const res = { errMsg: 'chooseImage:fail cancel' }
        reject(res)
      }
    }).catch(err => {
      console.log('error: ', err.errMsg)
      if (/showActionSheet:fail cancel/.test(err.errMsg)) {
        const res = { errMsg: 'chooseImage:fail cancel' }
        fail?.(res)
        complete?.(res)
        reject(res)
      }
    })
  })
}
