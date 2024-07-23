import { chooseMedia, MEDIA_TYPE } from '../media'

export function chooseImage(opts: Taro.chooseImage.Option): Promise<any> {
  return chooseMedia(opts, MEDIA_TYPE.Images)
}
