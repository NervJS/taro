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
import { TransformPage, globalAny } from './types/index'

export default function generatePage ({ sourceCode, filename, projectRoot, sourceDir }: TransformPage) {
  // 文件
  const extName = path.basename(filename).split('.')[0]
  const fileDir = path.dirname(filename)
  let result = sourceCode
  if (!(fileDir === sourceDir && extName === 'app')) { // 非入口文件
    const commonStyle = globalAny?.__taroCommonStyle || []
    if (commonStyle && commonStyle.length > 0) {
      const code: string[] = []
      const filePath = path.join(projectRoot, filename)
      commonStyle.forEach((item) => {
        let importStr = ''
        const relativePath = path.relative(path.dirname(filePath), item.path).replace(/\\/g, '/')
        const realPath = path.dirname(filePath) === path.dirname(item.path) ? `./${item.fileName}` : `${relativePath}`
        if (item.name) {
          importStr = `import ${item.name} from '${realPath}'`
        } else {
          importStr = `import '${realPath}'`
        }
        code.push(importStr)
      })
      result = code.join(';\n') + ';' + sourceCode
    }
  }
  return result
}
