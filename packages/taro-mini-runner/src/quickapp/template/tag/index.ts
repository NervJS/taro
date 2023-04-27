import { fs } from '@tarojs/helper'
import * as path from 'path'

export default function parseTag (dir: string, tags = {}) {
  dir = dir || '.'
  const dirPath = path.join(__dirname, dir)
  const walk = (file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isFile()) {
      if (path.extname(filePath) === '.js') {
        const tagName = path.basename(path.dirname(filePath))
        if (tagName !== 'tag') {
          const component = require(filePath).default
          tags[tagName] = component
        }
      }
    } else {
      parseTag(path.join(dir, file), tags)
    }
  }
  fs.readdirSync(dirPath).forEach(walk)
  return tags
}
