import { fs } from '@tarojs/helper'
import * as path from 'path'

export const declarations = {}
parse('.')

function parse (dir) {
  dir = dir || '.'
  const dirPath = path.join(__dirname, dir)
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isFile()) {
      if (path.extname(filePath) === '.js') {
        Object.assign(declarations, require(filePath).default)
      }
    } else {
      parse(path.join(dir, file))
    }
  })
}

export default function rewriter (declaration, rule, output) {
  if (!declaration.position) {
    declaration.position = {
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 1
      }
    }
  }
  if (declaration.property.indexOf('-webkit-') === 0) {
    declaration.property = declaration.property.replace('-webkit-', '')
  }

  if (declarations.hasOwnProperty(declaration.property)) {
    let processDeclaration = declarations[declaration.property]
    if (typeof processDeclaration === 'function') {
      // 将样式名作为函数名处理样式值
      processDeclaration = processDeclaration(declaration.value, declaration, function (property, value) {
        output.declaration.inserted.push({
          property,
          value
        })
      }, rule)
    }
    if (Array.isArray(processDeclaration)) { // 直接增加一组
      output.declaration.inserted.concat(processDeclaration)
    } else if (typeof processDeclaration === 'object') { // 直接增加一条
      output.declaration.inserted.push(processDeclaration)
    } else if (typeof processDeclaration === 'string') {
      if (processDeclaration.indexOf('I:') === 0) { // 删除
        output.declaration.deleted.push(declaration)
      } else if (processDeclaration.indexOf('W:') === 0) { // 警告
        output.declaration.deleted.push(declaration)
      } else if (processDeclaration.indexOf('E:') === 0) { // 错误
        output.declaration.deleted.push(declaration)
        const msg = 'E: 样式`' + declaration.property + ':' + declaration.value + '`不支持'
        output.logs.push({
          reason: msg,
          line: declaration.position.start.line,
          column: declaration.position.start.column
        })
      }
    }
  } else {
    output.declaration.deleted.push(declaration)
  }
}
