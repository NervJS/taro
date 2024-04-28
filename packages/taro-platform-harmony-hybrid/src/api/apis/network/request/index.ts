import { request as h5Request } from '@tarojs/taro-h5'

import { request as nativeReuqest } from './nativeRequest'


/**
 * 封装请求方法
 * @param options 请求选项
 * @param useNativeRequest 默认使用true
 */
export function request (options: any, useNativeRequest: boolean = false) {
  return useNativeRequest ? nativeReuqest(options) : h5Request(options)
}


