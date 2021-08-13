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
