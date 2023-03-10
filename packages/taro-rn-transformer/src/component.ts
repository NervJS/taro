/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import * as path from 'path'

import { globalAny, TransformPage } from './types/index'
import { transformLinaria } from './utils'

export default function componentLoader ({ sourceCode, filename, projectRoot, sourceDir }: TransformPage) {
  const filePath = path.join(projectRoot, filename)

  // 文件
  const extName = path.basename(filename).split('.')[0]
  const fileDir = path.dirname(filename)
  let result = sourceCode
  // 入口文件不加入全局样式 commonStyle
  if (!(fileDir === sourceDir && extName === 'app')) {
    const commonStyle = globalAny?.__taroCommonStyle || []
    if (commonStyle && commonStyle.length > 0) {
      const code: string[] = []
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

  // linaria transform
  let linaria
  try {
    linaria = require('linaria')
  } catch (e) {} // eslint-disable-line no-empty

  if (linaria) {
    let transformResult
    try {
      transformResult = transformLinaria({
        sourcePath: filePath,
        sourceCode: result
      })
    } catch (e) {
      console.error(e)
    }

    // linaria 转换的代码
    if (transformResult && transformResult.code) {
      result = transformResult.code
    }
  }

  return result
}
