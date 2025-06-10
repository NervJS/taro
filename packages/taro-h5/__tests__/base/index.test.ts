import * as Taro from '@tarojs/taro-h5'

describe('others', () => {
  test('should covert arraybuffer to base64', () => {
    const arrayBuffer = new Uint8Array([11, 22, 33])
    const base64 = Taro.arrayBufferToBase64(arrayBuffer)
    expect(base64).toBe('CxYh')
  })

  test('should covert base64 to arraybuffer', () => {
    const base64 = 'CxYh'
    const arrayBuffer = Taro.base64ToArrayBuffer(base64)
    const initBuffer = new Uint8Array(arrayBuffer)
    expect(initBuffer[0]).toBe(11)
    expect(initBuffer[1]).toBe(22)
    expect(initBuffer[2]).toBe(33)
  })
})
