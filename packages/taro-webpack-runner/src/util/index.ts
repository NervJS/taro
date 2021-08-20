/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
      const isEnd = interfaces[devName]?.some(item => {
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
