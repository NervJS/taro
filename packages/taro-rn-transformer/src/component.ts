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
