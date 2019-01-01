import * as fs from 'fs-extra'
import * as path from 'path'

import { ICopyOptions } from './interface'

export function copyFileSync (from: string, to: string, options?: ICopyOptions) {
  const filename = path.basename(from)
  if (fs.statSync(from).isFile() && !path.extname(to)) {
    fs.ensureDir(to)
    if (from === path.join(to, filename)) {
      return
    }
    return fs.copySync(from, path.join(to, filename), options)
  }
  if (from === to) {
    return
  }
  fs.ensureDir(path.dirname(to))
  return fs.copySync(from, to, options)
}
