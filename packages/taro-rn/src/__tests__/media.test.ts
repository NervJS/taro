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

import { getImageInfo } from '../lib/getImageInfo'
import { saveImageToPhotosAlbum } from '../lib/saveImageToPhotosAlbum'
import { saveVideoToPhotosAlbum } from '../lib/saveVideoToPhotosAlbum'

const Taro = {
  getImageInfo,
  saveImageToPhotosAlbum,
  saveVideoToPhotosAlbum,
}

// 原生模块导出缺少 react_native_1.NativeModules.RNCCameraRoll setup mock

describe('media', () => {
  describe('getImageInfo', () => {
    test('能正确获取图片信息', () => {
      const url = 'https://img12.360buyimg.com/ling/jfs/t19387/224/2632923601/58290/3bbe4eda/5b03f63cN17d4a46c.png'
      const width = 320
      const height = 240
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(8)
      return Taro.getImageInfo({
        src: url,
        success,
        fail,
        complete
      }).then((res) => {
        const expectRes = {
          width,
          height,
          path: url,
          orientation: 'up',
          type: ''
        }
        expect(success.mock.calls.length).toBe(1)
        expect(success.mock.calls[0][0]).toMatchObject(expectRes)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toMatchObject(expectRes)
        expect(res.width).toEqual(width)
        expect(res.height).toEqual(height)
        expect(res.path).toEqual(url)
      })
    })
  })

  describe('saveImageToPhotosAlbum', () => {
    test('能够正常保存图片', () => {
      const url = 'test.io/a.png'
      const expectMsg = 'saveImageToPhotosAlbum:ok'

      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(6)
      return Taro.saveImageToPhotosAlbum({
        filePath: url,
        success,
        fail,
        complete
      }).then((res) => {
        const path = `photo://${url}`
        expect(success.mock.calls.length).toBe(1)
        expect(success.mock.calls[0][0]).toEqual({ errMsg: expectMsg, path })
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectMsg, path })
        // @ts-ignore
        expect(res.path).toEqual(path)
      })
    })
  })

  describe('saveVideoToPhotosAlbum', () => {
    test('能够正常保存视频', () => {
      const url = 'test.io/a.mp4'
      const expectMsg = 'saveVideoToPhotosAlbum:ok'

      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(6)
      return Taro.saveVideoToPhotosAlbum({
        filePath: url,
        success,
        fail,
        complete
      }).then((res) => {
        const path = `video://${url}`
        expect(success.mock.calls.length).toBe(1)
        expect(success.mock.calls[0][0]).toEqual({ errMsg: expectMsg, path })
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectMsg, path })
        // @ts-ignore
        expect(res.path).toEqual(path)
      })
    })
  })
})
