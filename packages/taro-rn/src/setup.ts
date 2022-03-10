import { jest } from '@jest/globals'
import '@testing-library/jest-native/extend-expect'
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'
import { NetInfoStateType } from '@react-native-community/netinfo'
import mockRNCAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock.js'
import mockRNCDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

jest.doMock('@react-native-community/netinfo', () => ({ ...mockRNCNetInfo, NetInfoStateType }))
jest.doMock('@react-native-async-storage/async-storage', () => mockRNCAsyncStorage)
jest.doMock('react-native-device-info', () => mockRNCDeviceInfo)

jest.doMock('react-native', () => {
  const ReactNative = jest.requireActual('react-native') as any

  // Vibration readonly so you need use defineProperty rewrite this property descriptor.
  const Vibration = (jest.requireActual('./__tests__/__mock__/mockVibrate') as any).default
  Object.defineProperty(ReactNative, 'Vibration', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Vibration
  })

  // mockNativeModules: react-native/Libraries/BatchedBridge/NativeModules
  const RNCCameraRoll = (jest.requireActual('./__tests__/__mock__/mockRNCCameraRoll') as any).default
  const MockClipboard = (jest.requireActual('./__tests__/__mock__/mockClipboard') as any).default
  const RNCGeolocation = (jest.requireActual('./__tests__/__mock__/mockRNCGeolocation') as any).default
  ReactNative.NativeModules.RNCCameraRoll = RNCCameraRoll
  ReactNative.NativeModules.RNCClipboard = new MockClipboard()
  ReactNative.NativeModules.RNCGeolocation = RNCGeolocation
  Object.defineProperty(ReactNative.NativeModules, 'ImageLoader', {
    configurable: true,
    enumerable: true,
    get: () => ({
      prefetchImage: jest.fn(),
      getSize: jest.fn((_uri, success: any) => {
        process.nextTick(() => success && success(320, 240))
        return Promise.resolve([320, 240])
      }),
    }),
  })
  return ReactNative
})

jest.doMock('@unimodules/core', () => {
  const unimodules = jest.requireActual('@unimodules/core') as any
  const permisson = jest.requireActual('./__tests__/__mock__/mockExpoPermissions')
  const { NativeModulesProxy } = unimodules

  NativeModulesProxy.ExpoLocation = {
    getCurrentPositionAsync: jest.fn(() => Promise.resolve({
      coords: {
        latitude: 0,
        longitude: 0,
        speed: 0,
        accuracy: 0,
        altitude: 0
      }
    }))
  }
  NativeModulesProxy.ExpoPermissions = permisson

  return unimodules
})

jest.doMock('react-native-unimodules', () => {
  const unimodules = jest.requireActual('react-native-unimodules') as any
  const permisson = jest.requireActual('./__tests__/__mock__/mockExpoPermissions')
  unimodules.Permissions = permisson
  return unimodules
})
