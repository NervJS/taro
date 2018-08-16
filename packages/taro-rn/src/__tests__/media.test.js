import CameraRoll from './__mock__/mockCameraRoll'
import Taro from '../index.js'

Taro.initNativeApi(Taro)

describe('media', () => {
  beforeEach(() => {
    jest.setMock('CameraRoll', CameraRoll)
  })

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
          orientation: null,
          type: null
        }
        expect(success.mock.calls.length).toBe(1)
        expect(success.mock.calls[0][0]).toEqual(expectRes)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual(expectRes)
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
        expect(res.path).toEqual(path)
      })
    })
  })
})
