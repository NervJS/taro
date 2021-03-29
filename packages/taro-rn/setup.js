import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'
import mockRNCAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock.js'

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo)
jest.mock('@react-native-async-storage/async-storage', () => mockRNCAsyncStorage)

jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native')

  // Vibration readonly so you need use defineProperty rewrite this property descriptor.
  const Vibration = jest.requireActual('./src/__tests__/__mock__/mockVibrate').default
  Object.defineProperty(ReactNative, 'Vibration', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Vibration
  })

  // mockNativeModules: react-native/Libraries/BatchedBridge/NativeModules
  const RNCCameraRoll = jest.requireActual('./src/__tests__/__mock__/mockRNCCameraRoll').default
  const MockClipboard = jest.requireActual('./src/__tests__/__mock__/mockClipboard').default
  ReactNative.NativeModules.RNCCameraRoll = RNCCameraRoll
  ReactNative.NativeModules.RNCClipboard = new MockClipboard()
  ReactNative.NativeModules.RNCGeolocation = {
    addListener: jest.fn(),
    getCurrentPosition: jest.fn(),
    removeListeners: jest.fn(),
    requestAuthorization: jest.fn(),
    setConfiguration: jest.fn(),
    startObserving: jest.fn(),
    stopObserving: jest.fn(),
  }
  Object.defineProperty(ReactNative.NativeModules, 'ImageLoader', {
    configurable: true,
    enumerable: true,
    get: () => ({
      prefetchImage: jest.fn(),
      getSize: jest.fn((uri, success) => {
        process.nextTick(() => success && success(320, 240))
        return Promise.resolve([320, 240])
      }),
    }),
  })
  return ReactNative
})

jest.mock('@unimodules/core', () => {
  const unimodules = jest.requireActual('@unimodules/core')
  const permisson = jest.requireActual('./src/__tests__/__mock__/mockExpoPermissions')
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

jest.mock('react-native-unimodules', () => {
  const unimodules = jest.requireActual('react-native-unimodules')
  const permisson = jest.requireActual('./src/__tests__/__mock__/mockExpoPermissions')
  unimodules.Permissions = permisson
  return unimodules
})

configure({ adapter: new Adapter() })
