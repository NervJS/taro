/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { chooseMedia, MEDIA_TYPE } from '../media'
import { showActionSheet } from '../showActionSheet'

/**
 * 拍摄视频或从手机相册中选视频。
 * @param {Object} opts
 * @param {Array} [opts.sourceType=['album', 'camera']] ✔
 * @param {boolean} [opts.compressed=true] ✔
 * @param {number} [opts.maxDuration=60] - 拍摄视频最长拍摄时间，单位秒 ✖
 * @param {string} [opts.camera='back'] - 默认拉起的是前置或者后置摄像头。✖
 * @returns {Promise<*>}
 */
export function chooseVideo(opts: Taro.chooseVideo.Option): Promise<any> {
  const { sourceType, compressed } = opts
  opts = Object.assign(opts, { sizeType: compressed ? ['compressed'] : [] })
  switch (JSON.stringify(sourceType)) {
    case '[\'camera\']':
    case '["camera"]':
      return chooseMedia({...opts, sourceType: ['camera']}, MEDIA_TYPE.VIDEOS)
    case '[\'album\']':
    case '["album"]':
      return chooseMedia({...opts, sourceType: ['album']}, MEDIA_TYPE.VIDEOS)
    default:
      return showVideoPicker(opts)
  }
}

/**
 * 视频选择器
 * @param options
 * @returns {Promise}
 */
function showVideoPicker(options: Taro.chooseVideo.Option):any {
  const { fail, complete } = options
  return new Promise((resolve, reject) => { 
    showActionSheet({
      itemList: ['拍摄', '从手机相册选择'],
      success: function (res) {
        if (res.tapIndex === 0) {
          resolve(chooseMedia({...options, sourceType: ['camera']}, MEDIA_TYPE.VIDEOS))
        }
        if (res.tapIndex === 1) {
          resolve(chooseMedia({...options, sourceType: ['album']}, MEDIA_TYPE.VIDEOS))
        }
      },
      fail: function () {
        const res = { errMsg: 'chooseVideo:fail cancel' }
        reject(res)
      }
    }).catch(err => {
      console.log('error: ', err.errMsg)
      if (/showActionSheet:fail cancel/.test(err.errMsg)) {
        const res = { errMsg: 'chooseVideo:fail cancel' }
        fail?.(res)
        complete?.(res)
        reject(res)
      }
    })
  })
}
