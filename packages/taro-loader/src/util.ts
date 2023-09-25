import { fs } from '@tarojs/helper'
import * as path from 'path'

export function getRootPath (): string {
  return path.resolve(__dirname, '../')
}

export function getPkgVersion (): string {
  const pkgPath = path.join(getRootPath(), 'package.json')

  if (fs.existsSync(pkgPath)) {
    return require(pkgPath).version
  }

  return 'unknown'
}
