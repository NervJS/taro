import * as path from 'node:path'

import { fs } from '@tarojs/helper'

import type * as webpack from 'webpack'

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

export function stringifyRequest (loaderContext: webpack.LoaderContext<any>, request: string): string {
  return JSON.stringify(loaderContext.utils.contextify(loaderContext.context || loaderContext.rootContext, request))
}
