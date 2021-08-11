// import { DeviceMotion } from 'expo-sensors'
import * as Taro from '../lib/deviceMotion'

describe('deviceMotion', () => {
  it('should startDeviceMotionListening success', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.startDeviceMotionListening({
      success,
      fail,
      complete,
    })
    expect(success.mock.calls.length).toBe(1)
    expect(fail.mock.calls.length).toBe(0)
    expect(success.mock.calls.length).toBe(1)
  })
  it('should stopDeviceMotionListening success', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.stopDeviceMotionListening({
      success,
      fail,
      complete,
    })
    expect(success.mock.calls.length).toBe(1)
    expect(fail.mock.calls.length).toBe(0)
    expect(success.mock.calls.length).toBe(1)
  })
  // it('should onDeviceMotionChange success', () => {
  //   const change = jest.fn().mockImplementation((ret) => {
  //     expect(0).toBe(0)
  //   })
  //   Taro.onDeviceMotionChange(change)
  // })
})
