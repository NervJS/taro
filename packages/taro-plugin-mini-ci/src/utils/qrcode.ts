/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import * as Jimp from 'jimp'
import jsQR from 'jsqr'
import * as QRCode from 'qrcode'

/**
 * 读取出二维码图片中的文本内容
 * @param imagePath 图片路径
 */
export async function readQrcodeImageContent (imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Jimp.read(imagePath, function (err, image) {
      if (err) {
        reject(err)
        return
      }
      // @ts-ignore
      const scanData = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height)

      if (scanData) {
        resolve(scanData.data)
      } else {
        reject(new Error('扫描器 jsqr 未能识别出二维码内容'))
      }
    })
  })
}

/**
 * 将文本内容转换成二维码输出在控制台上
 * @param content
 */
export async function printQrcode2Terminal (content: string) {
  const terminalStr = await QRCode.toString(content, { type: 'terminal' })
  // eslint-disable-next-line no-console
  console.log(terminalStr)
}

/**
 * 生成二维码图片到指定目录
 * @param content
 * @param path
 */
export async function generateQrcodeImageFile (path: string, content: string) {
  await QRCode.toFile(path, content, {
    errorCorrectionLevel: 'L',
    type: 'png'
  })
}
