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

import * as sax from 'sax'
import { isUrlRequest, urlToRequest } from 'loader-utils'

export default function miniTemplateLoader (source) {
  this.cacheable && this.cacheable()
  /**
   * 两种fix方案：
   * 1. 用任意xml标签包裹source，使之变成较标准的xml格式（含有一个根节点）
   * 2. 修改 sax.parser 的第一个参数为 true，启用严格模式
   *    2.1 该模式下小程序模板中的标签或属性不会处理（例如写入<Import SrC="..." />不会处理成<import src="..." />，而是保持原样
   *    2.2 该模式将认为传入的xml为非标准的，无需标准化，且不按照以根节点模式处理，因此可以正常解析小程序模板
   *
   * 推荐方案1，这样在构建时会正常打入需要的包，但是若用户有 SrC 类似的写法导致引用失败，则可直接修正，不会认为是打包出现了问题
   **/
  const sourceWithRoot = `<root>${source}</root>`
  const parser = sax.parser(false, { lowercase: true })
  const requests: Set<string> = new Set()
  const callback = this.async()
  const loadModule = request =>
    new Promise((resolve, reject) => {
      this.addDependency(request)
      this.loadModule(request, (err, src) => {
        if (err) {
          reject(err)
        } else {
          resolve(src)
        }
      })
    })

  parser.onattribute = ({ name, value }) => {
    if (value && name === 'src' && isUrlRequest(value)) {
      const request = urlToRequest(value)
      requests.add(request)
    }
  }
  parser.onend = async () => {
    try {
      const requestsArray = Array.from(requests)
      if (requestsArray.length) {
        for (let i = 0; i < requestsArray.length; i++) {
          await loadModule(requestsArray[i])
        }
      }
      callback(null, source)
    } catch (error) {
      callback(error, source)
    }
  }
  parser.write(sourceWithRoot).close()
}
