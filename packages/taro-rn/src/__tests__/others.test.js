import { base64ToArrayBuffer } from '../lib/base64ToArrayBuffer'
import { arrayBufferToBase64 } from '../lib/arrayBufferToBase64'

const Taro = { base64ToArrayBuffer, arrayBufferToBase64 }

describe('base64 and arrayBuffer', () => {
  describe('arrayBufferToBase64', () => {
    test('能正常转换为base64', () => {
      const expectBase64 = 'CxZY'
      const arrayBuffer = new Uint8Array([11, 22, 88])
      const base64 = Taro.arrayBufferToBase64(arrayBuffer)
      expect(base64).toBe(expectBase64)
    })
  })

  describe('base64ToArrayBuffer', () => {
    test('能正常转换为ArrayBuffer', () => {
      const base64 = 'CxZY'
      const arrayBuffer = Taro.base64ToArrayBuffer(base64)
      expect(arrayBuffer[0]).toBe(11)
      expect(arrayBuffer[1]).toBe(22)
      expect(arrayBuffer[2]).toBe(88)
    })
  })
})
