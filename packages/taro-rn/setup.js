import 'react-native'
import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'
import mockRNCAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock.js'

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo)
jest.mock('@react-native-async-storage/async-storage', () => mockRNCAsyncStorage)

jest.mock('react-native', () => {
  const reactNaive = jest.requireActual('react-native')
  const RNCCameraRoll = jest.requireActual('@react-native-community/cameraroll/js/__mocks__/nativeInterface.js')
  const MockClipboard = jest.requireActual('./src/__tests__/__mock__/mockClipboard').default
  const Vibration = jest.requireActual('./src/__tests__/__mock__/mockVibrate').default

  reactNaive.NativeModules.RNCCameraRoll = RNCCameraRoll
  reactNaive.NativeModules.RNCClipboard = new MockClipboard()
  // Vibration readonly so you need use defineProperty rewrite this property descriptor.
  Object.defineProperty(reactNaive, 'Vibration', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Vibration
  })
  return reactNaive
})

jest.mock('@unimodules/core', () => {
  const unimodules = jest.requireActual('@unimodules/core')
  const permisson = jest.requireActual('./src/__tests__/__mock__/mockExpoPermissions')
  const { NativeModulesProxy } = unimodules

  NativeModulesProxy.ExpoLocation = {
    getCurrentPositionAsync: jest.fn().mockImplementation(() => Promise.resolve({
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
