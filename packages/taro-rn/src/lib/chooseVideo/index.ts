import { chooseMedia, MEDIA_TYPE } from '../media'

export function chooseVideo(opts: Taro.chooseVideo.Option): Promise<any> {
  return chooseMedia(opts, MEDIA_TYPE.Videos)
}
