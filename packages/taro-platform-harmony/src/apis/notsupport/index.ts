import { temporarilyNotSupport } from '../utils'

/** storage:start **/
export const getStorageSync = temporarilyNotSupport('getStorageSync', 'getStorage')
export const setStorageSync = temporarilyNotSupport('setStorageSync', 'setStorage')
export const clearStorageSync = temporarilyNotSupport('clearStorageSync', 'clearStorage')
export const removeStorageSync = temporarilyNotSupport('removeStorageSync', 'removeStorage')
/** storage:end **/


/** wx:start **/
export const login = temporarilyNotSupport('login')
export const navigateToMiniProgram = temporarilyNotSupport('navigateToMiniProgram')
export const requestSubscribeMessage = temporarilyNotSupport('requestSubscribeMessage')
export const getMenuButtonBoundingClientRect = temporarilyNotSupport('getMenuButtonBoundingClientRect')
/** wx:end **/
