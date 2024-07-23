import { Current } from '@tarojs/runtime'

/**
 * set writable, enumerable to true
 */
export function setDefaultDescriptor (obj: Record<string, any>) {
  obj.writable = true
  obj.enumerable = true
  return obj
}

/**
 * 设置入口的路由参数
 * @param options 小程序传入的参数
 */
export function setRouterParams (options) {
  Current.router = {
    params: options?.query,
    ...options
  }
}
