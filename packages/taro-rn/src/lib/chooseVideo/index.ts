import { chooseMedia, MEDIA_TYPE } from '../media'

/**
 * 拍摄视频或从手机相册中选视频。
 * @param {Object} opts
 * @param {Array} [opts.sourceType=['album', 'camera']] ✔
 * @param {boolean} [opts.compressed=true] ✔
 * @param {number} [opts.maxDuration=60] - 拍摄视频最长拍摄时间，单位秒 ✖
 * @param {string} [opts.maxDuration='camera'] - 默认拉起的是前置或者后置摄像头。✖
 * @returns {Promise<*>}
 */
export function chooseVideo(opts: Taro.chooseVideo.Option): Promise<any> {
  return chooseMedia(opts, MEDIA_TYPE.VIDEOS)
}
