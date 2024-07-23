import { chooseMedia as _chooseMedia, MEDIA_TYPE } from '../media'

export function chooseMedia (opts: Taro.chooseMedia.Option): Promise<any> {
  if (opts.mediaType?.length === 1) {
    if (opts.mediaType[0] === 'video') {
      return _chooseMedia(opts, MEDIA_TYPE.Videos)
    } else if (opts.mediaType[0] === 'image') {
      return _chooseMedia(opts, MEDIA_TYPE.Images)
    } else {
      return _chooseMedia(opts, MEDIA_TYPE.All)
    }
  } else {
    return _chooseMedia(opts, MEDIA_TYPE.All)
  }
}
