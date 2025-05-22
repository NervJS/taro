import path from 'node:path'

import { fs } from '@tarojs/helper'

// 指定要处理的目录路径
const directoryPath = path.join(__dirname, '../../../harmony_library/library/src/main/ets/npm/@tarojs/runtime/dist')

function removeReference(filePath: string) {
  const stat = fs.lstatSync(filePath)
  if (stat.isDirectory()) {
    fs.readdirSync(filePath).forEach(file => {
      removeReference(path.join(filePath, file))
    })
  } else if (filePath.endsWith('.d.ts')) {
    const content = fs.readFileSync(filePath, 'utf8')
    const modifiedContent = content.replace(/\/\/\/\s*<reference\s+.*\/>\s*\n/g, '')
    fs.writeFileSync(filePath, modifiedContent, 'utf8')
  }
}

removeReference(directoryPath)
