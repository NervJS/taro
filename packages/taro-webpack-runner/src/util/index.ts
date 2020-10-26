import * as path from 'path'

import { networkInterfaces } from 'os'

export const emptyObj = {}
export const emptyTogglableObj = {
  enable: false,
  config: {}
}

export const getRootPath = function () {
  return path.resolve(__dirname, '../../')
}

export const addLeadingSlash = (url: string) => (url.charAt(0) === '/' ? url : '/' + url)
export const addTrailingSlash = (url: string) => (url.charAt(url.length - 1) === '/' ? url : url + '/')

export const formatOpenHost = host => {
  let result = host
  // 配置host为0.0.0.0时,可以转换为ip打开, 其他以配置host默认打开
  if (result === '0.0.0.0') {
    // 设置localhost为初值, 防止没正确获取到host时以0.0.0.0打开
    result = 'localhost'
    const interfaces = networkInterfaces()
    for (const devName in interfaces) {
      const isEnd = interfaces[devName].some(item => {
        // 取IPv4, 不为127.0.0.1的内网ip
        if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal) {
          result = item.address
          return true
        }
        return false
      })
      // 若获取到ip, 结束遍历
      if (isEnd) {
        break
      }
    }
  }
  return result
}
