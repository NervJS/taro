import * as path from 'node:path'

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

export function printPkgVersion () {
  console.log(`👽 Taro v${getPkgVersion()}`)
  console.log()
}
