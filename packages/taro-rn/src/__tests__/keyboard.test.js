import { DeviceEventEmitter } from 'react-native'
import * as Taro from '../lib/keyboard'

describe('keyboard', () => {
  it('should hideKeyboard success', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.hideKeyboard({
      success,
      fail,
      complete,
    })
    expect(success.mock.calls.length).toBe(1)
    expect(fail.mock.calls.length).toBe(0)
    expect(success.mock.calls.length).toBe(1)
  })
  it('should onKeyboardHeightChange success', () => {
    expect.assertions(4)
    const endCoordinates = { height: 200 }
    const change = jest.fn().mockImplementation(({ height }) => expect(height).toBe(endCoordinates.height))
    Taro.onKeyboardHeightChange(change)
    DeviceEventEmitter.emit('keyboardDidShow', { endCoordinates })
    expect(change.mock.calls.length).toBe(1)
    endCoordinates.height = 0
    DeviceEventEmitter.emit('keyboardDidHide', { endCoordinates })
    expect(change.mock.calls.length).toBe(2)
    Taro.offKeyboardHeightChange(change)
  })

  it('should offKeyboardHeightChange success', () => {
    expect.assertions(4)
    const endCoordinates = { height: 200 }
    const firstChange = jest.fn()
    const secondChange = jest.fn()
    Taro.onKeyboardHeightChange(firstChange)
    Taro.onKeyboardHeightChange(secondChange)
    DeviceEventEmitter.emit('keyboardDidShow', { endCoordinates })
    expect(firstChange.mock.calls.length).toBe(1)
    expect(secondChange.mock.calls.length).toBe(1)
    Taro.offKeyboardHeightChange(secondChange)
    DeviceEventEmitter.emit('keyboardDidHide', { endCoordinates })
    expect(firstChange.mock.calls.length).toBe(2)
    expect(secondChange.mock.calls.length).toBe(1)
  })
})
