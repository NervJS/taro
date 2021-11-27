import { saveMedia } from '../media'

/**
 * 保存视频到系统相册。支持mp4视频格式。
 * @param opts
 * @param {string} opts.filePath - 视频文件路径，可以是临时文件路径也可以是永久文件路径
 * @returns {Promise<*>}
 */
export function saveVideoToPhotosAlbum(opts: Taro.saveVideoToPhotosAlbum.Option): Promise<TaroGeneral.CallbackResult> {
  return saveMedia(opts, 'video', 'saveVideoToPhotosAlbum')
}
