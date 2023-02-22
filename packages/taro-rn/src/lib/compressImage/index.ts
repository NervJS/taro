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

import ImageResizer, { ResizeFormat } from '@bam.tech/react-native-image-resizer'
import { Image } from 'react-native'
import { errorHandler, successHandler } from '../../utils'

/**
 * 压缩图片
 * @param opts
 */
export async function compressImage(opt: Taro.compressImage.Option): Promise<Taro.compressImage.SuccessCallbackResult> {
  const {
    src,
    quality = 80,
    success,
    fail,
    complete
  } = opt

  const res = { errMsg: 'compressImage:ok', tempFilePath: '' }

  const _createResizedImage = async (width = 800, height = 800) => {
    try {
      const compressFormat: ResizeFormat = src.toLocaleLowerCase().endsWith('.png') ? 'PNG' : 'JPEG'
      const { uri } = await ImageResizer.createResizedImage(src, width, height, compressFormat, quality)
      res.tempFilePath = uri
      return successHandler(success, complete)(res)
    } catch (err) {
      res.errMsg = err.message
      return errorHandler(fail, complete)(res)
    }
  }

  return Image.getSize(src, async (width, height) => {
    return await _createResizedImage(width, height)
  }, async () => {
    return await _createResizedImage()
  })
}
