/* eslint-disable */
import * as Taro from '../src/api'
describe('others', () => {
  test('should covert arraybuffer to base64', () => {
    const arrayBuffer = new Uint8Array([11, 22, 33])
    const base64 = Taro.arrayBufferToBase64(arrayBuffer)
    expect(base64).toBe('CxYh')
  })

  test('should covert base64 to arraybuffer', () => {
    const base64 = 'CxYh'
    const arrayBuffer = Taro.base64ToArrayBuffer(base64)
    expect(arrayBuffer[0]).toBe(11)
    expect(arrayBuffer[1]).toBe(22)
    expect(arrayBuffer[2]).toBe(33)
  })
})
