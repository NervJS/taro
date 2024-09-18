import { addInterceptor as h5AddInterceptor, cleanInterceptors as h5CleanInterceptors, request as h5Request } from '@tarojs/taro-h5'

import { addInterceptor as nativeAddInterceptor, cleanInterceptors as nativeCleanInterceptors, request as nativeReuqest } from './nativeRequest'

/**
 * 发起 HTTPS 网络请求
 *
 * @canUse request
 * @__object [url, data, header, timeout, method[OPTIONS, GET, HEAD, POST, PUT, PATCH, DELETE, TRACE, CONNECT], dataType[json, text, base64, arraybuffer], responseType[text, arraybuffer], enableCache]
 * @__success [data, header, statusCode, cookies]
 * @param useNativeRequest 默认使用true
 */
export function request (options: any, useNativeRequest: boolean = true) {
  return useNativeRequest ? nativeReuqest(options) : h5Request(options)
}


/**
 * 网络请求任务对象
 *
 * @canUse RequestTask
 * @__class [abort, onHeadersReceived, offHeadersReceived]
 */

/**
 * 使用拦截器
 *
 * @canUse addInterceptor
 */
export function addInterceptor (interceptor, useNativeRequest: boolean = true) {
  return useNativeRequest ? nativeAddInterceptor(interceptor) : h5AddInterceptor(interceptor)
}

/**
 * 清除所有拦截器
 *
 * @canUse cleanInterceptors
 */
export function cleanInterceptors (interceptor, useNativeRequest: boolean = true) {
  return useNativeRequest ? nativeCleanInterceptors(interceptor) : h5CleanInterceptors(interceptor)
}


