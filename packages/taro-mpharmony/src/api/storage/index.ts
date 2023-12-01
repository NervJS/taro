/** 
 * Taro.setStorage 的同步版本
 * 
 * @canUse setStorageSync
 * @__object [key, data]
*/
export { setStorageSync } from '@tarojs/taro-h5'

/**
 * 将数据存储在本地缓存中指定的 key 中
 * 
 * @canUse setStorage
 * @__object [data, key]
 */
export { setStorage } from '@tarojs/taro-h5'

/**
 * 根据 URL 销毁存在内存中的数据
 * 
 * @canNotUse revokeBufferURL
 */
export { revokeBufferURL } from '@tarojs/taro-h5'

/** 
 * Taro.removeStorage 的同步版本
 * 
 * @canUse removeStorageSync
*/
export { removeStorageSync } from '@tarojs/taro-h5'

/** 
 * 从本地缓存中移除指定 key
 * 
 * @canUse removeStorage
 * @__object [key]
*/
export { removeStorage } from '@tarojs/taro-h5'

/** 
 * Taro.getStorage 的同步版本
 * 
 * @canUse getStorageSync
*/
export { getStorageSync } from '@tarojs/taro-h5'

/** 
 * Taro.getStorageInfo 的同步版本
 * 
 * @canUse getStorageInfoSync
 * @__return [currentSize, keys, limitSize]
*/
export { getStorageInfoSync } from '@tarojs/taro-h5'

/** 
 * 异步获取当前storage的相关信息
 * 
 * @canUse getStorageInfo
 * @__success [currentSize, keys, limitSize]
*/
export { getStorageInfo } from '@tarojs/taro-h5'

/** 
 * 从本地缓存中异步获取指定 key 的内容
 * 
 * @canUse getStorage
 * @__object [key]
 * @__success [data]
*/
export { getStorage } from '@tarojs/taro-h5'

/**
 * 根据传入的 buffer 创建一个唯一的 URL 存在内存中
 * 
 * @canNotUse createBufferURL
 */
export { createBufferURL } from '@tarojs/taro-h5'

/** 
 * Taro.clearStorage 的同步版本
 * 
 * @canUse clearStorageSync
*/
export { clearStorageSync } from '@tarojs/taro-h5'

/** 
 * 清理本地数据缓存
 * 
 * @canUse clearStorage
*/
export { clearStorage } from '@tarojs/taro-h5'

/**
 * 创建缓存管理器
 * 
 * @canNotUse createCacheManager
 */
export * from './background-fetch'
export { createCacheManager } from '@tarojs/taro-h5'

/**
 * CacheManager实例
 * 
 * @canNotUse CacheManager
 */