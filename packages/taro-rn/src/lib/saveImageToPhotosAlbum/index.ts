import { saveMedia } from '../media'

/**
 * 保存图片到系统相册
 * @param opts
 * @param {string} opts.filePath  图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
 * @returns {*}
 */
export function saveImageToPhotosAlbum(opts: Taro.saveImageToPhotosAlbum.Option): Promise<TaroGeneral.CallbackResult> {
  return saveMedia(opts, 'photo', 'saveImageToPhotosAlbum')
}
